#!/bin/bash

echo "Creating Desktop Commander app using Automator..."

# Create an AppleScript that launches Desktop Commander
cat > /tmp/desktop-commander-launcher.scpt << 'EOF'
on run
    tell application "Terminal"
        activate
        do script "desktop-commander interactive"
    end tell
end run
EOF

# Compile the AppleScript to an app
osacompile -o "/Users/edwardharrison/Desktop/Desktop Commander Launcher.app" /tmp/desktop-commander-launcher.scpt

# Create a nice icon (if possible)
if [ -f "DesktopCommander.icns" ]; then
    cp "DesktopCommander.icns" "/Users/edwardharrison/Desktop/Desktop Commander Launcher.app/Contents/Resources/applet.icns"
fi

# Clean up
rm /tmp/desktop-commander-launcher.scpt

echo "✅ Created 'Desktop Commander Launcher.app' on your Desktop!"
echo ""
echo "You now have a proper app icon that you can:"
echo "- Double-click to launch"
echo "- Drag to your Dock"
echo "- Put in your Applications folder"