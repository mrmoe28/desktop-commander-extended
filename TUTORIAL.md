# 🎯 Desktop Commander Tutorial
*Your friendly guide to desktop automation*

<div align="center">
  <img src="https://img.shields.io/badge/Desktop%20Commander-v1.0-blueviolet?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-green?style=for-the-badge" alt="Platform">
</div>

---

## 🌟 Welcome!

Desktop Commander is like having a smart assistant for your computer. It can take screenshots, control web browsers, and automate repetitive tasks - all from simple commands!

### 🤔 What's an MCP?

MCP (Model Context Protocol) tools are programs that AI assistants can use to help you. Desktop Commander is special because YOU can use it directly too!

---

## 🚀 Getting Started (5 minutes)

### Step 1: Installation

<table>
<tr>
<td width="50%">

#### 🖱️ Easy Way
1. **Double-click** the Desktop Commander app
2. Click **"Install"** when prompted
3. Wait for Terminal to finish (about 30 seconds)

</td>
<td width="50%">

#### ⌨️ Terminal Way
```bash
curl -fsSL https://raw.githubusercontent.com/mrmoe28/desktop-commander-extended/main/install.sh | bash
```

</td>
</tr>
</table>

### Step 2: First Launch

Once installed, you have options:

```bash
# Interactive mode (recommended for beginners)
desktop-commander interactive

# Or use the short version
dc interactive
```

---

## 📸 Your First Screenshot

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">

### Try This Now:

1. **Launch Desktop Commander**
   ```bash
   dc interactive
   ```

2. **Choose Option 1**: Take screenshot
   
3. **Success!** Your screenshot is saved in the current folder

</div>

### 🎯 Pro Tip: Capture Specific Areas

```bash
# Capture a 500x300 pixel area starting at position (100, 100)
dc capture-area -x 100 -y 100 -w 500 -h 300
```

---

## 🌐 Browser Magic

Desktop Commander can control web browsers! Here's how:

### Simple Example:

<table>
<tr>
<td>

```bash
# 1. Open a website
dc browse https://github.com

# 2. Take a screenshot
dc browser-screenshot

# 3. All done!
```

</td>
<td>
<div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
  <strong>💡 What just happened?</strong><br>
  • Opened GitHub in a browser<br>
  • Took a full-page screenshot<br>
  • Saved it to your computer
</div>
</td>
</tr>
</table>

---

## 🎮 Interactive Mode Guide

When you run `dc interactive`, you'll see:

```
=== Desktop Commander Interactive Mode ===

What would you like to do?
❯ Take screenshot
  Capture screen area
  Browser automation
  Exit
```

### Navigation:
- Use **↑↓** arrow keys to move
- Press **Enter** to select
- Choose **Exit** when done

---

## 💫 Cool Things to Try

### 1. **Daily Screenshot Journal**
```bash
# Take a screenshot with timestamp
dc screenshot -o "journal-$(date +%Y%m%d-%H%M).png"
```

### 2. **Website Monitor**
```bash
# Check how a website looks
dc browse https://your-website.com --headless
dc browser-screenshot -o website-check.png
```

### 3. **Quick Documentation**
```bash
# Capture part of your screen for documentation
dc capture-area -x 0 -y 100 -w 800 -h 600 -o tutorial-step.png
```

---

## 🛠️ Command Reference Card

<table>
<tr>
<th>What You Want</th>
<th>Command to Use</th>
</tr>
<tr>
<td>📸 Full screenshot</td>
<td><code>dc screenshot</code></td>
</tr>
<tr>
<td>✂️ Partial screenshot</td>
<td><code>dc capture-area -x 0 -y 0 -w 500 -h 300</code></td>
</tr>
<tr>
<td>🌐 Open website</td>
<td><code>dc browse https://example.com</code></td>
</tr>
<tr>
<td>📄 Webpage screenshot</td>
<td><code>dc browser-screenshot</code></td>
</tr>
<tr>
<td>🎯 Interactive menu</td>
<td><code>dc interactive</code></td>
</tr>
<tr>
<td>❓ Get help</td>
<td><code>dc --help</code></td>
</tr>
</table>

---

## 🏃 Quick Start Challenge

Try these 3 tasks to become a Desktop Commander pro:

- [ ] **Task 1**: Take a screenshot and find it on your Desktop
- [ ] **Task 2**: Use browser mode to screenshot your favorite website  
- [ ] **Task 3**: Capture just a small area of your screen

---

## 🆘 Troubleshooting

<details>
<summary><strong>❌ "Command not found"</strong></summary>

Run the installer again:
```bash
curl -fsSL https://raw.githubusercontent.com/mrmoe28/desktop-commander-extended/main/install.sh | bash
```
</details>

<details>
<summary><strong>❌ "Permission denied" on macOS</strong></summary>

1. Go to **System Preferences** → **Security & Privacy**
2. Click **Screen Recording**
3. Check the box next to **Terminal**
</details>

<details>
<summary><strong>❌ Area capture not working</strong></summary>

Fix the Sharp module:
```bash
dc fix-sharp
```
</details>

---

## 🎉 Congratulations!

You're now ready to use Desktop Commander! Remember:

- 🚀 Start with `dc interactive` when unsure
- 📸 Screenshots save to your current folder
- 🌐 Browser automation works on any website
- ❓ Use `dc --help` anytime

### 🔗 Useful Links

- **GitHub**: [Desktop Commander Extended](https://github.com/mrmoe28/desktop-commander-extended)
- **Issues**: [Report Problems](https://github.com/mrmoe28/desktop-commander-extended/issues)
- **Updates**: Star the repo to get notified!

---

<div align="center">
  <strong>Happy automating! 🚀</strong>
  
  Made with ❤️ by the Desktop Commander team
</div>