import puppeteer from 'puppeteer';
import os from 'os';
import { execSync } from 'child_process';

// Global browser instance
let browser = null;
let page = null;

// Find Chrome executable based on platform
function findChrome() {
  const platform = os.platform();
  
  // Common Chrome paths
  const chromePaths = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      // Homebrew installations
      '/opt/homebrew/bin/chromium',
      '/usr/local/bin/chromium'
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Chromium\\Application\\chrome.exe'
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium'
    ]
  };

  const paths = chromePaths[platform] || [];
  
  // Check each path
  for (const chromePath of paths) {
    try {
      if (platform === 'win32') {
        // Windows file check
        execSync(`if exist "${chromePath}" echo found`, { encoding: 'utf8' });
        return chromePath;
      } else {
        // Unix file check
        execSync(`test -f "${chromePath}"`, { encoding: 'utf8' });
        return chromePath;
      }
    } catch (e) {
      // Path doesn't exist, continue checking
    }
  }
  
  // If no Chrome found, return null to use Puppeteer's bundled Chromium
  return null;
}

export async function openBrowser(options = {}) {
  const { url, headless = false } = options;
  
  try {
    if (browser) {
      await browser.close();
    }
    
    const chromePath = findChrome();
    
    const launchOptions = {
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    };
    
    // Only set executablePath if we found Chrome
    if (chromePath) {
      launchOptions.executablePath = chromePath;
      console.log(`Using Chrome at: ${chromePath}`);
    } else {
      console.log('Using bundled Chromium');
    }
    
    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set a user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    return { browser, page, success: true };
  } catch (error) {
    throw new Error(`Failed to open browser: ${error.message}`);
  }
}

export async function browserScreenshot(options = {}) {
  const { fullPage = true, outputPath } = options;
  
  if (!page) {
    throw new Error('No browser page open. Use open_browser first.');
  }
  
  const screenshot = await page.screenshot({ 
    fullPage,
    path: outputPath 
  });
  
  return screenshot;
}

export async function clickElement(selector, wait = true) {
  if (!page) {
    throw new Error('No browser page open.');
  }
  
  if (wait) {
    await page.waitForSelector(selector, { visible: true });
  }
  await page.click(selector);
}

export async function typeText(selector, text, clear = true) {
  if (!page) {
    throw new Error('No browser page open.');
  }
  
  await page.waitForSelector(selector, { visible: true });
  
  if (clear) {
    await page.click(selector, { clickCount: 3 });
  }
  
  await page.type(selector, text);
}

export async function getPageContent(selector = 'body', type = 'text') {
  if (!page) {
    throw new Error('No browser page open.');
  }
  
  const content = await page.evaluate((sel, contentType) => {
    const element = document.querySelector(sel);
    if (!element) return null;
    return contentType === 'text' ? element.textContent : element.innerHTML;
  }, selector, type);
  
  return content;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
}

export function getBrowserInstance() {
  return { browser, page };
}