const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

const publicDir = path.resolve(__dirname, '..', 'public');
const outputPath = path.resolve(__dirname, '..', 'app', 'data', 'image-dimensions.json');

const foldersToScan = ['images/Homeware', 'images/Objects'];
const imageExtensions = /\.(jpe?g|png|webp|gif)$/i;

const dimensions = {};

for (const folder of foldersToScan) {
  const folderPath = path.join(publicDir, folder);

  if (!fs.existsSync(folderPath)) {
    console.warn(`Skipping missing folder: ${folderPath}`);
    continue;
  }

  const files = fs.readdirSync(folderPath).filter(file => imageExtensions.test(file));

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const buffer = fs.readFileSync(filePath);
    const size = imageSize(buffer);
    const publicPath = '/' + folder.replace(/\\/g, '/') + '/' + file;
    dimensions[publicPath] = { width: size.width, height: size.height };
  }
}

fs.writeFileSync(outputPath, JSON.stringify(dimensions, null, 2));
console.log('Synced dimensions for ' + Object.keys(dimensions).length + ' images → app/data/image-dimensions.json');
