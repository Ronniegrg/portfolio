import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const file = 'D:/Independant Projects/portfolio/public/manifest.webmanifest';
  const content = readFileSync(file, 'utf8');
  JSON.parse(content);
  console.log('JSON is valid');
} catch(e) {
  console.error('Error:', e.message);
}
