#!/usr/bin/env python3

import os
import subprocess
import base64

# Create an SVG icon with a rounded square and camera/screenshot logo
svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient background -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6B46C1;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333EA;stop-opacity:1" />
    </linearGradient>
    
    <!-- Shadow filter -->
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feFlood flood-color="#000000" flood-opacity="0.3"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Rounded square background -->
  <rect x="64" y="64" width="896" height="896" rx="160" ry="160" fill="url(#bgGradient)" filter="url(#shadow)"/>
  
  <!-- Inner glow/border -->
  <rect x="84" y="84" width="856" height="856" rx="140" ry="140" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
  
  <!-- Camera/Screenshot Icon -->
  <g transform="translate(512, 512)">
    <!-- Camera body -->
    <rect x="-220" y="-140" width="440" height="320" rx="40" ry="40" fill="white" opacity="0.95"/>
    
    <!-- Camera lens outer ring -->
    <circle cx="0" cy="20" r="120" fill="#6B46C1" opacity="0.9"/>
    <circle cx="0" cy="20" r="100" fill="white"/>
    
    <!-- Camera lens inner -->
    <circle cx="0" cy="20" r="80" fill="#7C3AED"/>
    <circle cx="0" cy="20" r="60" fill="#9333EA"/>
    
    <!-- Lens reflection -->
    <ellipse cx="-20" cy="0" rx="25" ry="40" fill="rgba(255,255,255,0.5)" transform="rotate(-30 0 20)"/>
    
    <!-- Viewfinder -->
    <rect x="-180" y="-190" width="100" height="50" rx="15" ry="15" fill="white" opacity="0.95"/>
    
    <!-- Flash -->
    <rect x="120" y="-190" width="60" height="50" rx="15" ry="15" fill="white" opacity="0.95"/>
    
    <!-- Screenshot corners indicator -->
    <g opacity="0.8">
      <!-- Top left corner -->
      <path d="M -280 -200 L -280 -160 M -280 -200 L -240 -200" stroke="white" stroke-width="16" stroke-linecap="round" fill="none"/>
      <!-- Top right corner -->
      <path d="M 280 -200 L 280 -160 M 280 -200 L 240 -200" stroke="white" stroke-width="16" stroke-linecap="round" fill="none"/>
      <!-- Bottom left corner -->
      <path d="M -280 200 L -280 160 M -280 200 L -240 200" stroke="white" stroke-width="16" stroke-linecap="round" fill="none"/>
      <!-- Bottom right corner -->
      <path d="M 280 200 L 280 160 M 280 200 L 240 200" stroke="white" stroke-width="16" stroke-linecap="round" fill="none"/>
    </g>
  </g>
</svg>'''

# Save SVG file
with open('DesktopCommander.svg', 'w') as f:
    f.write(svg_content)

print("Creating professional rounded square icon...")

# Convert SVG to PNG at high resolution
subprocess.run(['qlmanage', '-t', '-s', '1024', '-o', '.', 'DesktopCommander.svg'], 
               stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

# Rename the output file
if os.path.exists('DesktopCommander.svg.png'):
    os.rename('DesktopCommander.svg.png', 'DesktopCommander.png')
else:
    # Fallback: try using sips to convert
    subprocess.run(['sips', '-s', 'format', 'png', 'DesktopCommander.svg', '--out', 'DesktopCommander.png'], 
                   stderr=subprocess.DEVNULL)

# Create iconset directory
iconset_dir = 'DesktopCommander.iconset'
os.makedirs(iconset_dir, exist_ok=True)

# Generate all required icon sizes
sizes = [
    (16, 16), (16, 32),      # 16pt
    (32, 32), (32, 64),      # 32pt  
    (64, 64), (64, 128),     # 64pt
    (128, 128), (128, 256),  # 128pt
    (256, 256), (256, 512),  # 256pt
    (512, 512), (512, 1024)  # 512pt
]

for size, scale in sizes:
    if scale == size:
        filename = f'icon_{size}x{size}.png'
    else:
        filename = f'icon_{size}x{size}@2x.png'
    
    output_path = os.path.join(iconset_dir, filename)
    subprocess.run(['sips', '-z', str(scale), str(scale), 'DesktopCommander.png', '--out', output_path],
                   stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

# Convert to .icns
subprocess.run(['iconutil', '-c', 'icns', iconset_dir, '-o', 'DesktopCommander.icns'])

print("✅ Created DesktopCommander.icns")

# Apply to apps
apps_to_update = [
    "/Users/edwardharrison/Desktop/Desktop Commander.app/Contents/Resources/AppIcon.icns",
    "/Users/edwardharrison/Desktop/Desktop Commander Launcher.app/Contents/Resources/applet.icns"
]

for app_icon_path in apps_to_update:
    if os.path.exists(os.path.dirname(app_icon_path)):
        subprocess.run(['cp', 'DesktopCommander.icns', app_icon_path])
        # Touch the app to refresh icon
        app_path = app_icon_path.split('/Contents/')[0]
        subprocess.run(['touch', app_path])
        print(f"✅ Updated icon for {os.path.basename(app_path)}")

# Also set icon for .command file if it exists
command_file = "/Users/edwardharrison/Desktop/Desktop Commander.command"
if os.path.exists(command_file):
    # Use SetFile to set custom icon (if available)
    subprocess.run(['SetFile', '-a', 'C', command_file], stderr=subprocess.DEVNULL)
    
    # Use Rez to add icon (if available)
    subprocess.run(['Rez', '-append', 'DesktopCommander.icns', '-o', command_file], stderr=subprocess.DEVNULL)

# Cleanup
subprocess.run(['rm', '-rf', iconset_dir, 'DesktopCommander.svg', 'DesktopCommander.png'], stderr=subprocess.DEVNULL)

print("\n✨ Icon created and applied successfully!")
print("You may need to:")
print("1. Click on Desktop and refresh (Cmd+Shift+.)")
print("2. Or log out and back in to see the new icons")