const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = String.raw`C:\Users\Aliaspieces\.gemini\antigravity\brain\5ee36fdf-31f5-46c1-a7b8-d60db8811f12\marketing_walkthrough_1766940659214.webp`;
const outputFile = String.raw`C:\Users\Aliaspieces\Desktop\demo_marketing.mp4`;

console.log(`Starting conversion from ${inputFile} to ${outputFile}...`);

ffmpeg(inputFile)
    .output(outputFile)
    .videoCodec('libx264')
    .noAudio() // WebP usually doesn't have audio, but good to be explicit
    .on('end', () => {
        console.log('Conversion finished successfully!');
    })
    .on('error', (err) => {
        console.error('Error during conversion:', err);
        process.exit(1);
    })
    .run();
