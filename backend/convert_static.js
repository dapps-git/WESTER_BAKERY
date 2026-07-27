import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const publicDir = path.join(process.cwd(), '../frontend/public')
const folders = ['food', 'drinks', 'cakes']

async function convertFolder(folderName) {
  const dirPath = path.join(publicDir, folderName)
  if (!fs.existsSync(dirPath)) return

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(dirPath, file)
      const baseName = path.basename(file, ext)
      const outputPath = path.join(dirPath, `${baseName}.webp`)

      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath)
        console.log(`Converted: ${folderName}/${file} -> ${baseName}.webp`)
      } catch (err) {
        console.error(`Failed ${file}:`, err.message)
      }
    }
  }
}

async function run() {
  for (const f of folders) {
    await convertFolder(f)
  }
  console.log('✅ All static images converted to WebP!')
}

run()
