#!/bin/bash

# Create a custom icon for Desktop Commander using ImageMagick or sips

echo "Creating custom icon for Desktop Commander..."

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
ICON_FILE="$TEMP_DIR/DesktopCommander.png"
ICONSET_DIR="$TEMP_DIR/DesktopCommander.iconset"

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create icon..."
    
    # Create a gradient background with camera emoji
    convert -size 1024x1024 \
        -background "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" \
        -fill white \
        -font Arial-Bold \
        -pointsize 600 \
        -gravity center \
        -annotate +0+0 "📸" \
        "$ICON_FILE"
else
    echo "Creating icon using system tools..."
    
    # Create a simple icon using system tools
    # Create a purple square with rounded corners
    cat > "$TEMP_DIR/icon.svg" << 'EOF'
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#grad)"/>
  <text x="512" y="600" font-family="Arial" font-size="500" fill="white" text-anchor="middle">📸</text>
</svg>
EOF
    
    # Convert SVG to PNG using sips (macOS built-in)
    qlmanage -t -s 1024 -o "$TEMP_DIR" "$TEMP_DIR/icon.svg" 2>/dev/null
    mv "$TEMP_DIR/icon.svg.png" "$ICON_FILE" 2>/dev/null
fi

# Create iconset directory
mkdir -p "$ICONSET_DIR"

# Generate different sizes (using sips - built into macOS)
for size in 16 32 64 128 256 512 1024; do
    sips -z $size $size "$ICON_FILE" --out "$ICONSET_DIR/icon_${size}x${size}.png" 2>/dev/null
    
    # Create @2x versions for Retina displays
    if [ $size -le 512 ]; then
        size2x=$((size * 2))
        sips -z $size2x $size2x "$ICON_FILE" --out "$ICONSET_DIR/icon_${size}x${size}@2x.png" 2>/dev/null
    fi
done

# Convert to .icns file
iconutil -c icns "$ICONSET_DIR" -o "DesktopCommander.icns"

echo "✅ Created DesktopCommander.icns"

# Apply to the app if it exists
if [ -d "/Users/edwardharrison/Desktop/Desktop Commander.app" ]; then
    cp "DesktopCommander.icns" "/Users/edwardharrison/Desktop/Desktop Commander.app/Contents/Resources/AppIcon.icns"
    
    # Refresh the icon
    touch "/Users/edwardharrison/Desktop/Desktop Commander.app"
    
    echo "✅ Applied icon to Desktop Commander.app"
fi

# Apply to .command file if it exists
if [ -f "/Users/edwardharrison/Desktop/Desktop Commander.command" ]; then
    # Use Finder to set custom icon
    osascript << EOF
    use framework "AppKit"
    
    set iconPath to POSIX file "$PWD/DesktopCommander.icns"
    set filePath to POSIX file "/Users/edwardharrison/Desktop/Desktop Commander.command"
    
    set imageData to (current application's NSImage's alloc()'s initWithContentsOfFile:iconPath)
    (current application's NSWorkspace's sharedWorkspace()'s setIcon:imageData forFile:filePath options:0)
EOF
    
    echo "✅ Applied icon to Desktop Commander.command"
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "Icon created! To see the changes:"
echo "1. Click on Desktop"
echo "2. Press Cmd+Shift+. to refresh if needed"