# Desktop Commander CLI 🖥️

A powerful command-line tool for desktop automation, screenshot capture, and browser control. Works seamlessly on Apple Silicon and Intel Macs, Windows, and Linux.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)

## ✨ Features

- 📸 **Screenshot Capture** - Full screen or specific area screenshots
- 🌐 **Browser Automation** - Control web browsers programmatically via Puppeteer
- 🎯 **Interactive Mode** - User-friendly guided interface
- 🚀 **Cross-Platform** - Universal support for M1/M2 Macs, Intel Macs, Windows, and Linux
- 🔧 **Easy Installation** - One-line install with automatic architecture detection

## 🚀 Quick Start

### 📥 Easy Installation Options

#### Option 1: Download Installer (Easiest)
[![Download Installer](https://img.shields.io/badge/Download-Install%20Script-brightgreen?style=for-the-badge&logo=download)](https://github.com/mrmoe28/desktop-commander-extended/releases/latest/download/install.sh)

1. Click the button above to download `install.sh`
2. Open Terminal where you downloaded it
3. Run: `bash install.sh`

#### Option 2: Download Ready-to-Use App
[![Download App](https://img.shields.io/badge/Download-Desktop%20Commander-blue?style=for-the-badge&logo=download)](https://github.com/mrmoe28/desktop-commander-extended/releases/latest/download/desktop-commander-cli.zip)

1. Click to download the zip file
2. Extract it
3. Double-click `install.sh` (Mac/Linux) or `install.bat` (Windows)

#### Option 3: One-Line Installation (Advanced)
```bash
curl -fsSL https://raw.githubusercontent.com/mrmoe28/desktop-commander-extended/main/install.sh | bash
```

### Alternative Installation Methods

#### NPM Global Install
```bash
npm install -g desktop-commander-cli
```

#### From Source
```bash
git clone https://github.com/mrmoe28/desktop-commander-extended.git
cd desktop-commander
npm install
npm link
```

## 📖 Usage

### Basic Commands

```bash
# Take a screenshot
desktop-commander screenshot

# Capture specific area
desktop-commander capture-area -x 100 -y 100 -w 500 -h 300

# Open a browser
desktop-commander browse https://example.com

# Interactive mode
desktop-commander interactive
```

### Screenshot Examples

```bash
# Save to specific location
desktop-commander screenshot -o ~/Desktop/my-screenshot.png

# Different format
desktop-commander screenshot -f jpg

# Capture area with output
desktop-commander capture-area -x 0 -y 0 -w 800 -h 600 -o area.png
```

### Browser Automation

```bash
# Open URL in browser
desktop-commander browse https://github.com

# Take browser screenshot
desktop-commander browser-screenshot --full-page

# Run in headless mode
desktop-commander browse https://example.com --headless
```

## 🎮 Interactive Mode

Launch the interactive mode for a guided experience:

```bash
desktop-commander interactive
```

This provides a menu-driven interface for:
- Taking screenshots
- Capturing screen areas
- Browser automation
- Step-by-step guidance

## 🛠️ Advanced Usage

### Browser Automation Mode

```bash
desktop-commander browser
```

This opens an interactive browser control session where you can:
- Navigate to URLs
- Click elements
- Type text
- Extract page content
- Take screenshots

### Scripting Example

```bash
#!/bin/bash
# Automated screenshot script

# Take daily screenshots
while true; do
  desktop-commander screenshot -o "screenshot-$(date +%Y%m%d-%H%M%S).png"
  sleep 86400 # Wait 24 hours
done
```

## 🔧 Platform-Specific Notes

### macOS
- **Apple Silicon (M1/M2)**: Automatically detected and configured
- **Intel Macs**: Full support with automatic optimization
- **Permissions**: Grant screen recording permissions in System Preferences

### Windows
- Run Command Prompt or PowerShell as Administrator for best results
- Use `desktop-commander.exe` if installed via Windows installer

### Linux
- May require additional dependencies: `sudo apt-get install libx11-dev libxkbfile-dev`
- Wayland users may need to use X11 compatibility layer

## 📋 System Requirements

- Node.js 18.0.0 or higher
- 4GB RAM recommended
- 100MB free disk space
- Internet connection for browser automation features

## 🐛 Troubleshooting

### Common Issues

#### "Command not found"
```bash
# Add to PATH
export PATH="$PATH:$HOME/.desktop-commander"

# Or reinstall
curl -fsSL https://raw.githubusercontent.com/mrmoe28/desktop-commander-extended/main/install.sh | bash
```

#### Sharp Module Issues (Area Capture)
```bash
# Fix Sharp for your platform
desktop-commander fix-sharp

# Or manually reinstall
cd ~/.desktop-commander && npm run fix-sharp
```

#### Permission Denied
- **macOS**: Enable screen recording in System Preferences > Security & Privacy
- **Linux**: Run with `sudo` if necessary
- **Windows**: Run as Administrator

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Puppeteer](https://pptr.dev/) for browser automation
- Screenshot capture powered by [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop)
- Image processing with [Sharp](https://sharp.pixelplumbing.com/)
- Originally based on MCP (Model Context Protocol) architecture

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/mrmoe28/desktop-commander-extended/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mrmoe28/desktop-commander-extended/discussions)

---

Made with ❤️ by the Desktop Commander Team