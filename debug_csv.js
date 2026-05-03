const fs = require('fs');

function countColumns(file) {
    if (!fs.existsSync(file)) {
        console.log(file, 'not found');
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const header = lines[0].trim().split(',');
    
    // Parse first full row (handling newlines inside quotes)
    let inQuote = false;
    let commas = 0;
    let fields = [];
    let currentField = '';
    
    // start from the character after the first newline
    const startIndex = content.indexOf('\n') + 1;
    
    for (let i = startIndex; i < content.length; i++) {
        const c = content[i];
        if (c === '"') {
            inQuote = !inQuote;
            currentField += c;
        } else if (c === ',' && !inQuote) {
            commas++;
            fields.push(currentField);
            currentField = '';
        } else if (c === '\n' && !inQuote) {
            fields.push(currentField);
            break; // End of row
        } else {
            currentField += c;
        }
    }
    
    console.log(`--- ${file} ---`);
    console.log(`Header columns: ${header.length}`);
    console.log(`Row 1 commas: ${commas} (implies ${commas + 1} columns)`);
    if (header.length !== commas + 1) {
        console.log(`MISMATCH! Header has ${header.length}, but row has ${commas + 1}`);
        console.log(`Last field: ${fields[fields.length - 1]}`);
    } else {
        console.log('Columns match header!');
        console.log(`Cost per item (idx 43): ${fields[43]}`);
        console.log(`Status (idx 44): ${fields[44]}`);
    }
}

countColumns('fragry_products_flawless.csv');
countColumns('KM_Parfumerie_Products_UTF8.csv');
