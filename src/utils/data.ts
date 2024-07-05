import fs from 'fs';
import path from 'path';

export const ensureFileExists = (filePath: string, defaultContent: string = '[]') => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, defaultContent, 'utf-8');
  }
};

export const readFile = (filePath: string): any[] => {
  ensureFileExists(filePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

export const writeFile = (filePath: string, data: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
