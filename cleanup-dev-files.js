#!/usr/bin/env node

/**
 * Cleanup Development Files
 * Removes test files, debug files, and other development artifacts
 * Run this before committing to production
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 CLEANING UP DEVELOPMENT FILES');
console.log('=================================\n');

// Files to remove
const filesToRemove = [
    // Backend test files
    'backend/test-cloudinary.js',
    'backend/test-upload-endpoints.js',
    'backend/test-avatar-upload.js',
    'backend/test-google-oauth.js',
    'backend/test-google-flow.js',
    'backend/test-google-setup.js',
    'backend/test-user.js',
    'backend/test-email.js',
    'backend/create-test-user.js',
    'backend/google-oauth-setup-guide.js',
    'backend/verify_data.js',
    
    // Frontend debug files
    'frontend/debug-auth.js',
    
    // Documentation files (optional - comment out if you want to keep)
    'SESSION_MANAGEMENT_GUIDE.md',
    'SESSION_SUMMARY.md',
    'GOOGLE_OAUTH_FIX_GUIDE.md',
    'GOOGLE_LOGIN_DEBUG_GUIDE.md',
    'CLOUDINARY_SETUP_GUIDE.md',
    'PROFILE_UPDATE_TEST_GUIDE.md',
    
    // This cleanup script itself (uncomment if you want to remove it after running)
    // 'cleanup-dev-files.js'
];

// Directories to remove (be careful with these)
const dirsToRemove = [
    'backend/uploads/avatars', // Local uploads (using Cloudinary now)
];

let removedCount = 0;
let errorCount = 0;

// Remove files
filesToRemove.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✅ Removed: ${filePath}`);
            removedCount++;
        } else {
            console.log(`⚪ Not found: ${filePath}`);
        }
    } catch (error) {
        console.log(`❌ Error removing ${filePath}:`, error.message);
        errorCount++;
    }
});

// Remove directories
dirsToRemove.forEach(dirPath => {
    try {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`✅ Removed directory: ${dirPath}`);
            removedCount++;
        } else {
            console.log(`⚪ Directory not found: ${dirPath}`);
        }
    } catch (error) {
        console.log(`❌ Error removing directory ${dirPath}:`, error.message);
        errorCount++;
    }
});

console.log('\n📊 CLEANUP SUMMARY');
console.log('==================');
console.log(`✅ Files removed: ${removedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (errorCount === 0) {
    console.log('\n🎉 Cleanup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review changes: git status');
    console.log('2. Add files: git add .');
    console.log('3. Commit: git commit -m "Clean up development files"');
    console.log('4. Push: git push');
} else {
    console.log('\n⚠️  Some files could not be removed. Please check manually.');
}

console.log('\n💡 Note: .env file is preserved but ignored by git');
console.log('   Make sure to set up environment variables in production');