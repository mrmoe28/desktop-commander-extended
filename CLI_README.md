# Desktop Commander CLI

A powerful command-line tool for desktop interaction, including screenshot capture and browser automation.

## Features

- **Screenshot Capture**: Take full screen or area-specific screenshots
- **Browser Automation**: Control web browsers programmatically
- **Interactive Mode**: User-friendly interface for all features
- **Cross-platform**: Works on Windows, macOS, and Linux

## Installation

### From ZIP File

1. Download and extract the ZIP file
2. Navigate to the extracted directory
3. Run the appropriate script for your platform:
   - **macOS/Linux**: `./run.sh`
   - **Windows**: `run.bat`

### Manual Installation

```bash
# Install dependencies
npm install

# Make the CLI executable (macOS/Linux)
chmod +x cli.js

# Link globally (optional)
npm link
```

## Usage

### Command Line Interface

#### Take a Screenshot
```bash
# Full screen screenshot
./run.sh screenshot

# With custom output path and format
./run.sh screenshot -o ~/Desktop/screenshot.jpg -f jpg
```

#### Capture Screen Area
```bash
# Capture a 500x300 area starting at coordinates (100, 100)
./run.sh capture-area -x 100 -y 100 -w 500 -h 300
```

#### Browser Automation
```bash
# Open a URL
./run.sh browse https://example.com

# Open in headless mode
./run.sh browse https://example.com --headless

# Take browser screenshot
./run.sh browser-screenshot -o webpage.png
```

#### Interactive Mode
```bash
# Start interactive mode for guided usage
./run.sh interactive

# Browser-specific interactive mode
./run.sh browser
```

### Examples

#### Automated Web Scraping
```bash
# Open a page and take a screenshot
./run.sh browse https://github.com
./run.sh browser-screenshot --full-page -o github-page.png
```

#### Screen Monitoring
```bash
# Take periodic screenshots
while true; do
  ./run.sh screenshot -o "monitor-$(date +%Y%m%d-%H%M%S).png"
  sleep 60
done
```

## Available Commands

- `screenshot` - Take a full screen screenshot
- `capture-area` - Capture a specific area of the screen
- `browse <url>` - Open a URL in the browser
- `browser-screenshot` - Take a screenshot of the current browser page
- `browser` - Enter browser interactive mode
- `interactive` - Enter general interactive mode

## Options

### Global Options
- `-h, --help` - Display help information
- `-V, --version` - Display version information

### Screenshot Options
- `-o, --output <path>` - Output file path
- `-f, --format <format>` - Image format (png or jpg, default: png)

### Capture Area Options
- `-x, --x <number>` - X coordinate (required)
- `-y, --y <number>` - Y coordinate (required)
- `-w, --width <number>` - Width of capture area (required)
- `-h, --height <number>` - Height of capture area (required)
- `-o, --output <path>` - Output file path

### Browser Options
- `--headless` - Run browser in headless mode
- `--full-page` - Capture full page in screenshots

## Troubleshooting

### Common Issues

1. **"Command not found"**
   - Make sure you're in the correct directory
   - Ensure the script has execute permissions: `chmod +x run.sh`

2. **Screenshot failures**
   - Check screen permissions (especially on macOS)
   - Ensure no other screen recording software is running

3. **Browser automation issues**
   - Puppeteer will download Chromium on first run
   - Ensure you have sufficient disk space
   - Check internet connectivity

### Platform-Specific Notes

**macOS**: May require screen recording permissions. Grant access in System Preferences > Security & Privacy > Screen Recording.

**Linux**: May require additional dependencies:
```bash
sudo apt-get install libx11-dev libxkbfile-dev libgconf-2-4
```

**Windows**: Run as administrator if encountering permission issues.

## License

MIT License - See LICENSE file for details.