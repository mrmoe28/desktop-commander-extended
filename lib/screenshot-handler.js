import screenshot from 'screenshot-desktop';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

let sharp = null;
let sharpAvailable = false;

// Try to load sharp, but don't fail if it's not available
try {
  sharp = await import('sharp');
  sharpAvailable = true;
  console.log('✅ Sharp module loaded successfully');
} catch (error) {
  console.warn('⚠️  Sharp module not available. Area capture will be limited.');
  console.warn('   Run "npm run fix-sharp" to enable area capture.');
}

export async function takeScreenshot(options = {}) {
  const { output_path, format = 'png' } = options;
  
  const imgBuffer = await screenshot({ format });
  
  let savedPath = output_path;
  if (!savedPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    savedPath = path.join(os.tmpdir(), `screenshot-${timestamp}.${format}`);
  }
  
  await fs.writeFile(savedPath, imgBuffer);
  
  return {
    savedPath,
    buffer: imgBuffer,
    base64: imgBuffer.toString('base64')
  };
}

export async function captureArea(options) {
  const { x, y, width, height, output_path } = options;
  
  if (!sharpAvailable) {
    throw new Error(
      'Area capture requires the Sharp module. ' +
      'Please run "npm run fix-sharp" to install it for your platform.'
    );
  }
  
  // Take full screenshot first
  const imgBuffer = await screenshot({ format: 'png' });
  
  // Crop to specified area using sharp
  const croppedBuffer = await sharp.default(imgBuffer)
    .extract({ left: x, top: y, width, height })
    .toBuffer();
  
  let savedPath = output_path;
  if (!savedPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    savedPath = path.join(os.tmpdir(), `screenshot-area-${timestamp}.png`);
  }
  
  await fs.writeFile(savedPath, croppedBuffer);
  
  return {
    savedPath,
    buffer: croppedBuffer,
    base64: croppedBuffer.toString('base64')
  };
}

export function isSharpAvailable() {
  return sharpAvailable;
}