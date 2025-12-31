const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

// List of images in order
const imageDir = String.raw`C:\Users\Aliaspieces\Desktop\Captures_App`;
const images = [
    '01_Tableau_de_Bord.png',
    '02_Clients.png',
    '03_Contrats.png',
    '04_Detail_Contrat.png',
    '05_Suivi_Livrables.png',
    '06_SST_Prestataires.png',
    '07_Reporting.png',
    '09_A_Propos.png' // Skipping documents as it was 404 (or include it if we want to show everything)
];

// Create a temporary file list for ffmpeg concat
const listContent = images
    .map(img => `file '${path.join(imageDir, img).replace(/\\/g, '/')}'\nduration 3`)
    .join('\n');

// Repeat the last image to ensure it holds screen
const finalList = listContent + `\nfile '${path.join(imageDir, images[images.length - 1]).replace(/\\/g, '/')}'`;

const listPath = path.join(__dirname, 'images.txt');
fs.writeFileSync(listPath, finalList);

const outputFile = String.raw`C:\Users\Aliaspieces\Desktop\demo_slideshow.mp4`;

console.log(`Generating slideshow to ${outputFile}...`);

ffmpeg()
    .input(listPath)
    .inputOptions(['-f', 'concat', '-safe', '0'])
    .output(outputFile)
    .videoCodec('libx264')
    .outputOptions([
        '-pix_fmt', 'yuv420p', // Important for compatibility
        '-r', '30'
    ])
    .on('end', () => {
        console.log('Slideshow created successfully!');
        fs.unlinkSync(listPath); // Cleanup
    })
    .on('error', (err) => {
        console.error('Error creating slideshow:', err);
        if (fs.existsSync(listPath)) fs.unlinkSync(listPath);
        process.exit(1);
    })
    .run();
