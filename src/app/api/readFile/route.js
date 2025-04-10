import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const relativeFilePath = searchParams.get('filePath');
  
  // 拼接文件的绝对路径
  const filePath = path.join(process.cwd(), 'Books', relativeFilePath); // 拼接出安全的文件路径
  console.log('Requested file path:', filePath);  // 打印路径，检查是否正确

  try {
    // 检查文件是否存在，避免读取不存在的文件
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }

    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf-8');
    return new Response(content, { status: 200 });
  } catch (err) {
    console.error('Error reading file:', err);  // 打印读取错误
    return new Response(JSON.stringify({ error: 'Unable to read file' }), {
      status: 500,
    });
  }
}
