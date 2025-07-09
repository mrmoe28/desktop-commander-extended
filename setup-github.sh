#!/bin/bash

echo "=== GitHub Repository Setup for Desktop Commander CLI ==="
echo ""
echo "Before running this script, please:"
echo "1. Create a new repository on GitHub named 'desktop-commander'"
echo "2. Do NOT initialize it with README, .gitignore, or license"
echo ""
read -p "Press Enter when you've created the empty repository on GitHub..."

echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME

echo ""
echo "Setting up GitHub remote..."

# Add remote origin
git remote add origin "https://github.com/${GITHUB_USERNAME}/desktop-commander.git"

# Rename branch to main if necessary
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Your repository is now available at:"
echo "https://github.com/${GITHUB_USERNAME}/desktop-commander"
echo ""
echo "Next steps:"
echo "1. Update README.md with your actual GitHub username"
echo "2. Create a release on GitHub with the desktop-commander-cli.zip from dist/"
echo "3. Update install.sh with the correct GitHub raw content URL"
echo "4. Consider setting up GitHub Actions for automated releases"