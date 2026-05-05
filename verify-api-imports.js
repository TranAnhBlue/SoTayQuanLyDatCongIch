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
            checkAndFixApi(filePath);
        }
    });
}

function checkAndFixApi(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if api is used but NOT imported
    const apiUsed = /api\.(get|post|put|delete)/.test(content);
    const apiImported = /import api from/.test(content);
    
    if (apiUsed && !apiImported) {
        console.log(`Fixing missing api import in: ${filePath}`);
        
        // Calculate relative path to src/utils/api
        const relativePath = path.relative(path.dirname(filePath), path.join(srcDir, 'utils', 'api'));
        // Normalize for import (use / and add ./ if needed)
        let importPath = relativePath.replace(/\\/g, '/');
        if (!importPath.startsWith('.')) importPath = './' + importPath;
        
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import React')) {
                insertIndex = i + 1;
                break;
            }
        }
        
        lines.splice(insertIndex, 0, `import api from '${importPath}';`);
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    } else if (apiImported) {
        // Double check path is correct
        const match = content.match(/import api from '([^']+)';/);
        if (match) {
            const currentPath = match[1];
            const correctRelativePath = path.relative(path.dirname(filePath), path.join(srcDir, 'utils', 'api'));
            let correctPath = correctRelativePath.replace(/\\/g, '/');
            if (!correctPath.startsWith('.')) correctPath = './' + correctPath;
            
            if (currentPath !== correctPath && !currentPath.includes('node_modules')) {
                console.log(`Fixing incorrect api import path in: ${filePath}. Current: ${currentPath}, Correct: ${correctPath}`);
                content = content.replace(currentPath, correctPath);
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    }
}

walk(srcDir);
console.log('API import verification complete!');
