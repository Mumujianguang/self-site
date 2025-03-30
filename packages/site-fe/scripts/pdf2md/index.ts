import pdfToMd from '@opendocsg/pdf2md';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 定义常量存储硬编码的值
const PDF_FILE_PATH = `${__dirname}/林剑光-前端开发工程师.pdf`;
const MDX_FILE_PATH = `${__dirname}/resume.md`;

// 定义一个异步函数来处理 PDF 转换和文件写入
const convertPdfToMd = async () => {
    const pdfBuffer = fs.readFileSync(PDF_FILE_PATH)
    const md = await pdfToMd(pdfBuffer)

    // 输出到文件
    fs.writeFileSync(MDX_FILE_PATH, md)
    console.log('PDF 转换完成并保存为 MD 文件。')
};

// 调用异步函数
convertPdfToMd();