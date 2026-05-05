const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            fixDuplicateImports(filePath);
        }
    });
}

function fixDuplicateImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let apiImportLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("import api from") || lines[i].includes("import api,")) {
            apiImportLines.push(i);
        }
    }
    
    if (apiImportLines.length > 1) {
        console.log(`Found duplicate api imports in: ${filePath}`);
        // Keep the one that has more info (curly braces) or just the last one
        let lineToKeep = apiImportLines[0];
        for (let idx of apiImportLines) {
            if (lines[idx].includes('{')) {
                lineToKeep = idx;
                break;
            }
        }
        
        const newLines = lines.filter((line, index) => {
            if (apiImportLines.includes(index) && index !== lineToKeep) {
                return false;
            }
            return true;
        });
        
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    }
}

walk(srcDir);
console.log('Cleanup of duplicate imports complete!');
