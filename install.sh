#!/bin/bash
# Desktop Commander CLI Installer - Universal Mac Support

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Installation directory
INSTALL_DIR="$HOME/.desktop-commander"
BIN_DIR="/usr/local/bin"

echo -e "${BLUE}Installing Desktop Commander CLI...${NC}"

# Detect system architecture
ARCH=$(uname -m)
OS=$(uname -s)

echo -e "${BLUE}Detected system: ${OS} ${ARCH}${NC}"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18 or higher is required.${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

# Create installation directory
echo -e "${BLUE}Creating installation directory...${NC}"
rm -rf "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Copy files
echo -e "${BLUE}Copying files...${NC}"
cp -r "$(dirname "$0")"/{cli.js,package.json,package-lock.json,lib,scripts} "$INSTALL_DIR/" 2>/dev/null || true
cp "$(dirname "$0")"/CLI_README.md "$INSTALL_DIR/README.md" 2>/dev/null || true

# Install dependencies
cd "$INSTALL_DIR"
echo -e "${BLUE}Installing dependencies...${NC}"

# Clean install to avoid conflicts
rm -rf node_modules package-lock.json

# Install without optional dependencies first
npm install --no-optional --silent

# Platform-specific Sharp installation
echo -e "${BLUE}Configuring platform-specific modules...${NC}"
if [ "$OS" = "Darwin" ]; then
    if [ "$ARCH" = "arm64" ]; then
        echo -e "${YELLOW}Installing for Apple Silicon (M1/M2)...${NC}"
        npm install --arch=arm64 --platform=darwin sharp@^0.33.5 --include=optional
    else
        echo -e "${YELLOW}Installing for Intel Mac...${NC}"
        npm install --arch=x64 --platform=darwin sharp@^0.33.5 --include=optional
    fi
else
    echo -e "${YELLOW}Installing for ${OS}...${NC}"
    npm install sharp@^0.33.5 --include=optional
fi

# Create symlink
echo -e "${BLUE}Creating command link...${NC}"
sudo ln -sf "$INSTALL_DIR/cli.js" "$BIN_DIR/desktop-commander" 2>/dev/null || {
    echo -e "${YELLOW}Note: Could not create global command. You may need to run with sudo.${NC}"
    echo -e "${YELLOW}Alternative: Add this to your PATH: export PATH=\"\$PATH:$INSTALL_DIR\"${NC}"
}

# Make executable
chmod +x "$INSTALL_DIR/cli.js"

# Test installation
echo -e "${BLUE}Testing installation...${NC}"
if "$INSTALL_DIR/cli.js" --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Desktop Commander CLI installed successfully!${NC}"
    echo -e "${GREEN}Run 'desktop-commander --help' to get started.${NC}"
    
    # Check if area capture is available
    if ! node -e "import('$INSTALL_DIR/node_modules/sharp/lib/index.js')" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Note: Area capture may not be available.${NC}"
        echo -e "${YELLOW}   Run 'desktop-commander fix-sharp' if you need this feature.${NC}"
    fi
else
    echo -e "${RED}❌ Installation completed but verification failed.${NC}"
    echo -e "${YELLOW}Try running: $INSTALL_DIR/cli.js --help${NC}"
fi