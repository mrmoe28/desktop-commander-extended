# Desktop Commander CLI - Installation Guide

## 🚀 Quick Install (Recommended)

### One-line Installation
```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/desktop-commander/main/install.sh | bash
```

### From ZIP File
1. Download `desktop-commander-cli.zip`
2. Extract and run:
```bash
unzip desktop-commander-cli.zip
cd desktop-commander-cli
./install.sh
```

## 📦 Installation Methods

### Method 1: NPM Global Install
```bash
npm install -g desktop-commander-cli
```

### Method 2: Homebrew (macOS)
```bash
brew tap yourusername/desktop-commander
brew install desktop-commander
```

### Method 3: Manual Installation
```bash
# Clone or download the repository
git clone https://github.com/yourusername/desktop-commander.git
cd desktop-commander

# Run the installer
./install.sh
```

## 🔧 Platform-Specific Notes

### Apple Silicon (M1/M2) Macs
The installer automatically detects and configures for ARM64 architecture. If you experience issues with screenshots:
```bash
desktop-commander fix-sharp
```

### Intel Macs
The installer configures for x64 architecture automatically.

### Windows
Use the Windows installer or run with Node.js:
```bash
node cli.js --help
```

## ✅ Verify Installation
```bash
desktop-commander --version
desktop-commander --help
```

## 🛠️ Troubleshooting

### "Command not found"
Add to your PATH:
```bash
export PATH="$PATH:$HOME/.desktop-commander"
```

### Sharp Module Issues
If area capture isn't working:
```bash
# Fix Sharp for your platform
desktop-commander fix-sharp

# Or reinstall
cd ~/.desktop-commander
npm run fix-sharp
```

### Permission Errors
The installer may need sudo for global command:
```bash
sudo ./install.sh
```

## 🗑️ Uninstallation
```bash
# Remove global command
sudo rm /usr/local/bin/desktop-commander

# Remove installation directory
rm -rf ~/.desktop-commander

# NPM global uninstall
npm uninstall -g desktop-commander-cli
```

## 📋 System Requirements
- Node.js 18 or higher
- macOS, Linux, or Windows
- For screenshots: Screen recording permissions (macOS)

## 🆘 Getting Help
- Run `desktop-commander --help`
- Check the README for usage examples
- Report issues at: https://github.com/yourusername/desktop-commander/issues