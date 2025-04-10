/* eslint-disable no-unused-vars */
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const booksDir = path.join(process.cwd(), 'Books'); // Books 目录路径

  // 递归获取目录结构
  const getDirectoryStructure = (dir) => {
    const files = fs.readdirSync(dir);
    const dirStructure = files.map((file) => {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        return {
          type: 'directory',
          name: file,
          children: getDirectoryStructure(fullPath),  // 递归获取子目录
        };
      } else {
        return {
          type: 'file',
          name: file,
          path: path.relative(booksDir, fullPath),  // 使用相对路径
        };
      }
    });
    return dirStructure;
  };

  try {
    const structure = getDirectoryStructure(booksDir);

    // 返回目录结构
    return new Response(JSON.stringify(structure), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error reading directory structure:', err);
    return new Response(JSON.stringify({ error: 'Unable to read directory structure' }), {
      status: 500,
    });
  }
}
