#!/usr/bin/env node
import { execSync } from 'child_process';
import { platform, arch } from 'os';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 Configuring Sharp for your system...');

const isAppleSilicon = platform() === 'darwin' && arch() === 'arm64';
const isIntelMac = platform() === 'darwin' && arch() === 'x64';
const isWindows = platform() === 'win32';
const isLinux = platform() === 'linux';

try {
  // Remove existing sharp installation
  console.log('📦 Cleaning existing Sharp installation...');
  try {
    execSync('npm uninstall sharp', { stdio: 'inherit' });
  } catch (e) {
    // Ignore if not installed
  }

  // Install sharp with platform-specific options
  console.log(`🖥️  Detected: ${platform()} ${arch()}`);
  
  let installCommand = 'npm install sharp@^0.33.5';
  
  if (isAppleSilicon) {
    console.log('🍎 Installing Sharp for Apple Silicon...');
    installCommand += ' --arch=arm64 --platform=darwin';
  } else if (isIntelMac) {
    console.log('🍎 Installing Sharp for Intel Mac...');
    installCommand += ' --arch=x64 --platform=darwin';
  } else if (isWindows) {
    console.log('🪟 Installing Sharp for Windows...');
    installCommand += ` --arch=${arch()} --platform=win32`;
  } else if (isLinux) {
    console.log('🐧 Installing Sharp for Linux...');
    installCommand += ` --arch=${arch()} --platform=linux`;
  }

  // Add optional dependencies flag
  installCommand += ' --include=optional';

  console.log('📥 Installing Sharp...');
  execSync(installCommand, { stdio: 'inherit' });

  console.log('✅ Sharp configured successfully!');
} catch (error) {
  console.error('❌ Failed to configure Sharp:', error.message);
  console.log('\n💡 You can try manual installation:');
  console.log('   npm install --arch=arm64 --platform=darwin sharp');
  process.exit(1);
}