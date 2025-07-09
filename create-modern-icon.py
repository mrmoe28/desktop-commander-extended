#!/usr/bin/env python3

import os
import subprocess

# Create a modern, minimalist SVG icon
svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Modern gradient -->
    <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
    
    <!-- Subtle shadow -->
    <filter id="subtleShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Rounded square background with subtle depth -->
  <rect x="64" y="64" width="896" height="896" rx="180" ry="180" 
        fill="url(#modernGradient)" filter="url(#subtleShadow)"/>
  
  <!-- Modern screenshot icon -->
  <g transform="translate(512, 512)">
    <!-- Monitor/screen outline -->
    <rect x="-240" y="-180" width="480" height="300" rx="20" ry="20" 
          fill="none" stroke="white" stroke-width="24" opacity="0.9"/>
    
    <!-- Screen area with selection -->
    <rect x="-220" y="-160" width="440" height="260" rx="10" ry="10" 
          fill="rgba(255,255,255,0.2)"/>
    
    <!-- Selection area (screenshot indicator) -->
    <g>
      <!-- Dashed selection rectangle -->
      <rect x="-140" y="-100" width="280" height="160" rx="4" ry="4"
            fill="none" stroke="white" stroke-width="8" 
            stroke-dasharray="20,10" opacity="0.95"/>
      
      <!-- Corner handles -->
      <circle cx="-140" cy="-100" r="12" fill="white"/>
      <circle cx="140" cy="-100" r="12" fill="white"/>
      <circle cx="-140" cy="60" r="12" fill="white"/>
      <circle cx="140" cy="60" r="12" fill="white"/>
    </g>
    
    <!-- Stand/base -->
    <rect x="-60" y="120" width="120" height="80" rx="10" ry="10" fill="white" opacity="0.9"/>
    <rect x="-100" y="180" width="200" height="20" rx="10" ry="10" fill="white" opacity="0.9"/>
    
    <!-- Plus icon (add/capture indicator) -->
    <g transform="translate(180, -120)">
      <circle cx="0" cy="0" r="40" fill="white"/>
      <rect x="-20" y="-4" width="40" height="8" rx="4" ry="4" fill="#3B82F6"/>
      <rect x="-4" y="-20" width="8" height="40" rx="4" ry="4" fill="#3B82F6"/>
    </g>
  </g>
</svg>'''

# Save and convert
with open('ModernIcon.svg', 'w') as f:
    f.write(svg_content)

print("Creating modern minimalist icon...")

# Create high-res PNG
subprocess.run(['qlmanage', '-t', '-s', '1024', '-o', '.', 'ModernIcon.svg'], 
               stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

if os.path.exists('ModernIcon.svg.png'):
    os.rename('ModernIcon.svg.png', 'ModernIcon.png')

# Create ICNS
iconset_dir = 'ModernIcon.iconset'
os.makedirs(iconset_dir, exist_ok=True)

sizes = [(16, 16), (16, 32), (32, 32), (32, 64), (64, 64), (64, 128),
         (128, 128), (128, 256), (256, 256), (256, 512), (512, 512), (512, 1024)]

for size, scale in sizes:
    filename = f'icon_{size}x{size}{"@2x" if scale > size else ""}.png'
    output_path = os.path.join(iconset_dir, filename)
    subprocess.run(['sips', '-z', str(scale), str(scale), 'ModernIcon.png', '--out', output_path],
                   stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

subprocess.run(['iconutil', '-c', 'icns', iconset_dir, '-o', 'ModernIcon.icns'])

# Cleanup
subprocess.run(['rm', '-rf', iconset_dir, 'ModernIcon.svg', 'ModernIcon.png'])

print("✅ Created ModernIcon.icns")
print("\nTo use this icon instead:")
print("1. Copy ModernIcon.icns to DesktopCommander.icns")
print("2. Run create-rounded-icon.py again")