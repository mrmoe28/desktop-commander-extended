#!/bin/bash

# Create a simple macOS app bundle for Desktop Commander

APP_NAME="Desktop Commander"
APP_DIR="$APP_NAME.app"

echo "Creating macOS app bundle..."

# Create app structure
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Create the executable script
cat > "$APP_DIR/Contents/MacOS/DesktopCommander" << 'EOF'
#!/bin/bash

# Check if Desktop Commander is installed
if command -v desktop-commander &> /dev/null; then
    # Open Terminal with Desktop Commander
    osascript -e 'tell app "Terminal" to do script "desktop-commander interactive"'
else
    # Install Desktop Commander
    osascript -e 'display dialog "Desktop Commander is not installed. Click OK to install it." buttons {"Cancel", "Install"} default button "Install"'
    
    if [ $? -eq 0 ]; then
        # Open Terminal and run installation
        osascript -e 'tell app "Terminal" to do script "curl -fsSL https://raw.githubusercontent.com/mrmoe28/desktop-commander-extended/main/install.sh | bash && desktop-commander interactive"'
    fi
fi
EOF

chmod +x "$APP_DIR/Contents/MacOS/DesktopCommander"

# Create Info.plist
cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>DesktopCommander</string>
    <key>CFBundleIdentifier</key>
    <string>com.desktopcommander.app</string>
    <key>CFBundleName</key>
    <string>Desktop Commander</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
</dict>
</plist>
EOF

# Create a simple icon (you can replace this with a proper icon)
echo "📸" > "$APP_DIR/Contents/Resources/AppIcon.txt"

echo "✅ Created $APP_DIR"
echo ""
echo "To distribute:"
echo "1. Right-click $APP_DIR and select 'Compress'"
echo "2. Upload the zip file to your GitHub releases"
echo "3. Users can download and double-click to run!"

# Create a DMG installer (optional)
if command -v hdiutil &> /dev/null; then
    echo ""
    echo "Creating DMG installer..."
    
    # Create a temporary directory for DMG contents
    mkdir -p dmg-contents
    cp -r "$APP_DIR" dmg-contents/
    
    # Create DMG
    hdiutil create -volname "Desktop Commander" -srcfolder dmg-contents -ov -format UDZO "Desktop-Commander-Installer.dmg"
    
    # Cleanup
    rm -rf dmg-contents
    
    echo "✅ Created Desktop-Commander-Installer.dmg"
fi