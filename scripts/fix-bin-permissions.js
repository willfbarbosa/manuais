import fs from 'fs';
import path from 'path';

const binDir = path.join(process.cwd(), 'node_modules', '.bin');

if (fs.existsSync(binDir)) {
  try {
    const files = fs.readdirSync(binDir);
    for (const file of files) {
      const filePath = path.join(binDir, file);
      try {
        // Grant read, write, and execute permissions (0o755)
        fs.chmodSync(filePath, 0o755);
      } catch (e) {
        // Ignore individual file errors
      }
    }
    console.log('✅ Executable permissions granted to node_modules/.bin binaries.');
  } catch (err) {
    console.warn('⚠️ Could not chmod node_modules/.bin:', err.message);
  }
}
