const fs = require('fs');
const path = require('path');

try {
  const file = path.resolve('/d/Independant Projects/portfolio/public/manifest.webmanifest');
  const content = fs.readFileSync(file, 'utf8');
  JSON.parse(content);
  console.log('JSON is valid');
} catch(e) {
  console.error('Error:', e.message);
}
