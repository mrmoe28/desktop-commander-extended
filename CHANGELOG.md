# Changelog

All notable changes to Desktop Commander CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-09

### Added
- Initial release of Desktop Commander CLI
- Full screen screenshot capture
- Area-specific screenshot capture with coordinates
- Browser automation via Puppeteer
- Interactive mode for guided usage
- Cross-platform support (macOS, Linux, Windows)
- Universal Mac support (Apple Silicon M1/M2 and Intel)
- Automatic architecture detection for optimal performance
- One-line installation script
- Platform-specific Sharp module configuration
- Browser control features:
  - Navigate to URLs
  - Click elements
  - Type text
  - Extract page content
  - Take full-page screenshots
- Command-line interface with intuitive commands
- Comprehensive error handling and recovery

### Technical Features
- Built with Node.js 18+ for modern JavaScript support
- Modular architecture for easy extension
- Graceful fallback when optional dependencies fail
- Minimal dependencies for faster installation
- Portable distribution with bundled dependencies

### Security
- No telemetry or data collection
- All operations run locally
- MIT licensed for maximum flexibility