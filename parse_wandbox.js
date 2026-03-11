const fs = require('fs');
const data = JSON.parse(fs.readFileSync('wandbox_utf8.json', 'utf8'));
const pyCompilers = data.filter(c => c.language === 'Python');
console.log(pyCompilers.map(c => c.name));
