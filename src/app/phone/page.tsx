"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu, X, Folder, FileText } from 'lucide-react';
import { marked } from 'marked';
import './reader.css';

interface FileItem {
  type: 'file' | 'directory';
  name: string;
  path: string;
  children?: FileItem[];
}

export default function ReaderPage() {
  const router = useRouter();
  const [books, setBooks] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  // 当前文件夹中的文件列表
  const [currentFolderFiles, setCurrentFolderFiles] = useState<FileItem[]>([]);
  // 当前文件在当前文件夹中的索引
  const [currentFolderIndex, setCurrentFolderIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [content, setContent] = useState('');
  
  // 修改：使用对象而非Set来管理展开状态
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/getBooks')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        // 初始加载第一个文件夹中的第一个文件
        if (data.length > 0) {
          const firstFileFolder = findFirstFileFolder(data);
          if (firstFileFolder && firstFileFolder.files.length > 0) {
            setCurrentFolderFiles(firstFileFolder.files);
            loadFileContent(firstFileFolder.files[0]);
            setCurrentFile(firstFileFolder.files[0]);
            setCurrentFolderIndex(0);
          }
        }
      });
  }, []);

  // 查找第一个包含文件的文件夹
  function findFirstFileFolder(tree: FileItem[]): {path: string, files: FileItem[]} | null {
    for (const node of tree) {
      if (node.type === 'directory' && node.children) {
        // 找出当前文件夹中的所有文件
        const files = node.children.filter(child => child.type === 'file');
        if (files.length > 0) {
          return {path: node.path, files: files};
        }
        
        // 递归检查子文件夹
        const result = findFirstFileFolder(node.children);
        if (result) return result;
      }
    }
    return null;
  }

  // 获取文件所在的文件夹路径
  function getDirectoryPath(filePath: string): string {
    const lastSlashIndex = filePath.lastIndexOf('\\');
    return lastSlashIndex > 0 ? filePath.substring(0, lastSlashIndex) : '';
  }

  // 查找指定路径的文件夹，并返回其中的文件列表
  function findFolderFiles(tree: FileItem[], folderPath: string): FileItem[] {
    for (const node of tree) {
      console.log(node);
      if (node.type === 'directory') {
        if (node.path === folderPath && node.children) {
          // 返回此文件夹中的所有文件
          return node.children.filter(child => child.type === 'file');
        }
        
        if (node.children) {
          const result = findFolderFiles(node.children, folderPath);
          if (result.length > 0) return result;
        }
      }
    }
    return [];
  }

  function loadFileContent(file: FileItem) {
    if (file.type === 'file') {
      fetch(`/api/readFile?filePath=${encodeURIComponent(file.path)}`)
        .then(res => res.text())
        .then(text => {
          const htmlContent = marked.parse(text);
          setContent(htmlContent as string);
          setCurrentFile(file);
          
          // 更新当前文件夹文件列表和索引
          const dirPath = getDirectoryPath(file.path);
          const folderFiles = findFolderFiles(books, dirPath);
          if (folderFiles.length > 0) {
            setCurrentFolderFiles(folderFiles);
            const fileIndex = folderFiles.findIndex(f => f.path === file.path);
            setCurrentFolderIndex(fileIndex !== -1 ? fileIndex : 0);
          }
        })
        .catch(err => {
          console.error('Failed to load file content:', err);
        });
    }
  }

  function handlePrev() {
    if (currentFolderIndex > 0) {
      const newIndex = currentFolderIndex - 1;
      setCurrentFolderIndex(newIndex);
      loadFileContent(currentFolderFiles[newIndex]);
    }
  }

  function handleNext() {
    if (currentFolderIndex < currentFolderFiles.length - 1) {
      const newIndex = currentFolderIndex + 1;
      setCurrentFolderIndex(newIndex);
      loadFileContent(currentFolderFiles[newIndex]);
    }
  }
  
  // 切换文件夹展开/折叠状态
  const toggleFolder = (path: string) => {
    console.log(path)
    setExpandedFolders(prev => {
      // 创建一个新对象以避免直接修改状态
      return {
        ...prev,
        // 如果已展开则关闭，否则展开
        [path]: !prev[path]
      };
    });
  };

  // 渲染目录树
  function renderTree(tree: FileItem[], level = 0) {
    return tree.map((node, index) => {
      const isFolder = node.type === 'directory';
      // 使用对象检查展开状态
      const isExpanded = !!expandedFolders[node.path];
      
      // 使用更稳定的唯一键
      const uniqueKey = `${node.path || 'unknown'}-${level}-${index}`;
      
      return (
        <div key={uniqueKey} className="tree-item">
          <div
            className={`tree-node ${isExpanded ? 'tree-node-expanded' : ''}`}
            onClick={() => isFolder ? toggleFolder(node.path) : (loadFileContent(node), setDrawerOpen(false))}
          >
            {isFolder ? <Folder className="tree-icon" /> : <FileText className="tree-icon" />}
            <span>{node.name}</span>
          </div>
          {isFolder && isExpanded && node.children && (
            <div className="tree-children">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div className="reader-container">
      {/* 顶部导航栏 */}
      <div className="reader-header">
        <button onClick={() => router.push('/')} className="header-button">
          <ChevronLeft className="icon" />
        </button>
        <div className="header-title">阅读器</div>
        <button onClick={() => setDrawerOpen(true)} className="header-button">
          <Menu className="icon" />
        </button>
      </div>

      {/* 正文区 */}
      <div className="reader-content" dangerouslySetInnerHTML={{ __html: content }} />

      {/* 底部按钮区 */}
      <div className="reader-footer">
        <button
          onClick={handlePrev}
          disabled={currentFolderIndex === 0}
          className={`nav-button ${currentFolderIndex === 0 ? 'nav-button-disabled' : 'nav-button-active'}`}
        >
          上一章
        </button>
        <button
          onClick={handleNext}
          disabled={currentFolderIndex === currentFolderFiles.length - 1}
          className={`nav-button ${currentFolderIndex === currentFolderFiles.length - 1 ? 'nav-button-disabled' : 'nav-button-active'}`}
        >
          下一章
        </button>
      </div>
      <div className="bottom-spacer"></div>

      {/* 目录抽屉 */}
      {drawerOpen && (
        <div className="drawer-overlay">
          <div
            className="drawer-backdrop"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="drawer-panel">
            <div className="drawer-header">
              <span className="drawer-title">目录</span>
              <button onClick={() => setDrawerOpen(false)} className="header-button">
                <X className="icon" />
              </button>
            </div>
            {renderTree(books)}
          </div>
        </div>
      )}
    </div>
  );
}
