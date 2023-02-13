import * as fs from 'fs';

/**
 * 拷贝文件
 * @param path 原文件路径
 * @param destPath 拷贝到目的地路径
 */
export async function copyFile(path: string, destPath: string) {
  const rs = fs.createReadStream(path);
  const ws = fs.createWriteStream(destPath);
  rs.pipe(ws);
}

/**
 * 删除文件
 * @param path 删除文件路径
 */
export async function removeFile(path: string) {
  return new Promise((resolve) => {
    if (fs.existsSync(path)) {
      fs.unlink(path, () => {
        resolve('ok');
      });
    } else resolve('file_no_exists');
  });
}

// 创建目录
export async function createDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
