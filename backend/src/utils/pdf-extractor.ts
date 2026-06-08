import fs from 'fs';

import { PDFParse } from 'pdf-parse';

export async function extractPdfText(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  const parser = new PDFParse({ data: buffer });

  const d = {
    text: await parser.getText(),
    pages: await parser.getInfo({ parsePageInfo: true }),
  };
  console.log(d);
  return d;
}
