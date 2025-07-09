#!/bin/bash
# NPM Global Installation Script

echo "Installing Desktop Commander CLI globally via npm..."

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Copy package files
cp -r "$(dirname "$0")"/{cli.js,package.json,package-lock.json} "$TEMP_DIR/"

# Install globally
npm install -g .

# Cleanup
cd ~
rm -rf "$TEMP_DIR"

echo "✅ Desktop Commander installed globally!"
echo "Run 'desktop-commander --help' to get started."