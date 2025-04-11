'use client';

import { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { marked } from 'marked';
import Link from 'next/link';

interface FileItem {
  type: 'directory' | 'file';
  name: string;
  path: string;
  children?: FileItem[];
}

export default function Home() {
  const [bookStructure, setBookStructure] = useState<FileItem[]>([]);
  const [content, setContent] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('/api/getBooks');
      const data = await res.json();
      setBookStructure(data);
    };
    fetchBooks();
  }, []);

  const handleFileClick = async (filePath: string) => {
    //setCurrentFile(filePath);
  
    // 异步获取文件内容
    const res = await fetch(`/api/readFile?filePath=${encodeURIComponent(filePath)}`);
    const text = await res.text();
  
    // 确保marked转换结果是同步的，并将其传递给setContent
    const htmlContent = await marked(text);
    setContent(htmlContent);
  };
  
  const handleToggleAccordion = (bookName: string) => {
    setExpanded(prev => ({ ...prev, [bookName]: !prev[bookName] }));
  };

  const renderDirectory = (files: FileItem[]) => {
    return files.map((file, index) => {
      if (file.type === 'directory') {
        return (
          <div key={index}>
            <div style={{ cursor: 'pointer', marginTop: '10px' }} onClick={() => handleToggleAccordion(file.name)}>
              {expanded[file.name] ? <FaFolderOpen /> : <FaFolder />} {file.name}
            </div>
            {expanded[file.name] && (
              <div style={{ marginLeft: '20px' }}>
                {renderDirectory(file.children || [])}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={index}
            style={{ cursor: 'pointer', padding: '5px' }}
            onClick={() => handleFileClick(file.path)}
          >
            {file.name}
          </div>
        );
      }
    });
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
<Link href="/phone">
  <button style={{ position: 'fixed', bottom: '50px', right: '10px' }}>
    手机版
  </button>
</Link>
          <h2>书籍目录</h2>
          <div>{renderDirectory(bookStructure)}</div>
        </div>
        <div className='markdown-content' style={{ padding: '10px', width: 'calc(100% - 300px)' }}>
          <h2>内容预览</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      <button onClick={() => setDarkMode(!darkMode)} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
        {darkMode ? '切换到浅色模式' : '切换到深色模式'}
      </button>
    </div>
  );
}
