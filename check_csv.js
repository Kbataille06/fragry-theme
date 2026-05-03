const fs = require('fs');
const lines = fs.readFileSync('products_export.csv', 'utf8').split('\n');
const header = lines[0].trim().split(',');
const row = lines[1].trim();
let fields = [];
let current = '';
let inQuote = false;
for(let i=0; i<row.length; i++) {
    const c = row[i];
    if(c === '"') {
        inQuote = !inQuote;
    } else if(c === ',' && !inQuote) {
        fields.push(current);
        current = '';
    } else {
        current += c;
    }
}
fields.push(current);
header.forEach((h, i) => console.log(h + ': ' + fields[i]));
