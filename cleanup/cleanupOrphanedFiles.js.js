const fs = require('fs');
const path = require('path');

const MEDIA_ROOT = path.join(__dirname, 'media');

function cleanupOrphanedFiles() {
    console.log('🟢 Starting cleanup...');

    // Get all channel folders
    const channels = fs.readdirSync(MEDIA_ROOT).filter(f => 
        fs.statSync(path.join(MEDIA_ROOT, f)).isDirectory()
    );

    channels.forEach(channel => {
        const channelPath = path.join(MEDIA_ROOT, channel);
        console.log(`\n📂 Processing channel: ${channel}`);

        // Get all files in channel folder
        const files = fs.readdirSync(channelPath);
        const videoIds = new Set();

        // First pass: Find all video IDs from .mp4 files
        files.forEach(file => {
            if (file.endsWith('.mp4')) {
                videoIds.add(file.replace('.mp4', ''));
            }
        });

        // Second pass: Delete orphaned files
        files.forEach(file => {
            const fileBase = file.split('.')[0]; // Get base name (without extension)

            // Always keep these special files
            if (file === 'folder.jpg' || 
                file === 'tvshow.nfo' || 
                file.startsWith('UC') || 
                fileBase === channel) {
                console.log(`🔒 Keeping: ${file}`);
                return;
            }

            // Delete if no matching .mp4 exists
            if (!videoIds.has(fileBase) && 
                ['.info.json', '.nfo', '.jpg', '.webp'].some(ext => file.endsWith(ext))) {
                try {
                    fs.unlinkSync(path.join(channelPath, file));
                    console.log(`🗑️ Deleted: ${file}`);
                } catch (err) {
                    console.error(`❌ Failed to delete ${file}:`, err.message);
                }
            }
        });
    });
}

cleanupOrphanedFiles();