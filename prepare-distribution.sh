#!/bin/bash

# Script to prepare the Desktop Commander CLI for distribution

echo "Preparing Desktop Commander CLI for distribution..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIST_NAME="desktop-commander-cli"
DIST_DIR="$SCRIPT_DIR/dist/$DIST_NAME"

# Clean previous distribution
rm -rf "$SCRIPT_DIR/dist"
mkdir -p "$DIST_DIR"

# Copy necessary files
echo "Copying files..."
cp "$SCRIPT_DIR/cli.js" "$DIST_DIR/"
cp "$SCRIPT_DIR/package.json" "$DIST_DIR/"
cp "$SCRIPT_DIR/package-lock.json" "$DIST_DIR/"
cp "$SCRIPT_DIR/run.sh" "$DIST_DIR/"
cp "$SCRIPT_DIR/run.bat" "$DIST_DIR/"
cp "$SCRIPT_DIR/install.sh" "$DIST_DIR/"
cp "$SCRIPT_DIR/CLI_README.md" "$DIST_DIR/README.md"
cp "$SCRIPT_DIR/INSTALLATION.md" "$DIST_DIR/"
cp "$SCRIPT_DIR/LICENSE" "$DIST_DIR/" 2>/dev/null || echo "MIT License" > "$DIST_DIR/LICENSE"

# Copy lib and scripts directories
cp -r "$SCRIPT_DIR/lib" "$DIST_DIR/"
cp -r "$SCRIPT_DIR/scripts" "$DIST_DIR/"

# Copy node_modules (for portability)
echo "Copying dependencies..."
cp -r "$SCRIPT_DIR/node_modules" "$DIST_DIR/"

# Make scripts executable
chmod +x "$DIST_DIR/run.sh"
chmod +x "$DIST_DIR/cli.js"

# Create the zip file
echo "Creating zip file..."
cd "$SCRIPT_DIR/dist"
zip -r "$DIST_NAME.zip" "$DIST_NAME"

# Calculate size
SIZE=$(du -sh "$DIST_NAME.zip" | cut -f1)

echo ""
echo "✅ Distribution package created successfully!"
echo "📦 File: $SCRIPT_DIR/dist/$DIST_NAME.zip"
echo "📏 Size: $SIZE"
echo ""
echo "The zip file contains:"
echo "  - Desktop Commander CLI application"
echo "  - All required dependencies"
echo "  - Platform-specific run scripts (run.sh for Mac/Linux, run.bat for Windows)"
echo "  - Complete documentation"
echo ""
echo "Users can extract and run immediately without needing to install dependencies!"