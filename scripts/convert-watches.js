const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

const SOURCE_DIR = 'C:\\1Rexton\\product image\\watches';
const DEST_IMG_DIR = path.join(__dirname, '..', 'public', 'images', 'watches');
const DEST_VIDEO_DIR = path.join(__dirname, '..', 'public', 'videos');

async function run() {
  if (!fs.existsSync(DEST_IMG_DIR)) {
    fs.mkdirSync(DEST_IMG_DIR, { recursive: true });
  }
  if (!fs.existsSync(DEST_VIDEO_DIR)) {
    fs.mkdirSync(DEST_VIDEO_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR);
  console.log(`Found ${files.length} items in ${SOURCE_DIR}`);

  let convertedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(SOURCE_DIR, file);

    if (file.toLowerCase().endsWith('.mp4')) {
      const destVideoPath = path.join(DEST_VIDEO_DIR, 'rexton-watch-reel.mp4');
      fs.copyFileSync(fullPath, destVideoPath);
      console.log(`🎥 Copied video ${file} to public/videos/rexton-watch-reel.mp4`);
      continue;
    }

    if (file.toLowerCase().endsWith('.heic')) {
      const baseName = path.parse(file).name;
      const destFile = `${baseName}.jpg`;
      const destPath = path.join(DEST_IMG_DIR, destFile);

      if (fs.existsSync(destPath)) {
        console.log(`[${i + 1}/${files.length}] Skipping existing: ${destFile}`);
        convertedCount++;
        continue;
      }

      console.log(`[${i + 1}/${files.length}] Converting ${file}...`);
      try {
        const inputBuffer = fs.readFileSync(fullPath);
        const outputBuffer = await heicConvert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.85,
        });

        fs.writeFileSync(destPath, outputBuffer);
        convertedCount++;
        console.log(`  -> Saved ${destFile} (${(outputBuffer.length / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  ❌ Error converting ${file}:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Completed converting ${convertedCount} watch images to ${DEST_IMG_DIR}`);
}

run();
