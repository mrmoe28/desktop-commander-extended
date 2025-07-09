#!/bin/bash
# Quick installer for Desktop Commander CLI
# Usage: curl -fsSL https://your-domain.com/install.sh | bash

set -e

REPO_URL="https://github.com/yourusername/desktop-commander/releases/latest/download/desktop-commander-cli.zip"
TEMP_DIR=$(mktemp -d)
INSTALL_DIR="$HOME/.desktop-commander"

echo "📦 Downloading Desktop Commander CLI..."
cd "$TEMP_DIR"

# For now, we'll simulate with local file
# In production, this would download from GitHub releases:
# curl -fsSL "$REPO_URL" -o desktop-commander.zip

# For local testing, copy the zip
cp "/Users/edwardharrison/Desktop/Desktop Commander Extended MCP/dist/desktop-commander-cli.zip" "$TEMP_DIR/desktop-commander.zip"

echo "📂 Extracting files..."
unzip -q desktop-commander.zip

echo "🚀 Running installer..."
cd desktop-commander-cli
bash install.sh

# Cleanup
cd ~
rm -rf "$TEMP_DIR"

echo "✨ Done! Run 'desktop-commander --help' to get started."