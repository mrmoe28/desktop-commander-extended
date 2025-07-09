#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import screenshot from 'screenshot-desktop';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global browser instance
let browser = null;
let page = null;

class DesktopCommanderExtended {
  constructor() {
    this.server = new Server(
      {
        name: 'desktop-commander-extended',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'take_screenshot',
          description: 'Take a screenshot of the entire screen or active window',
          inputSchema: {
            type: 'object',
            properties: {
              output_path: {
                type: 'string',
                description: 'Optional path to save the screenshot'
              },
              format: {
                type: 'string',
                enum: ['png', 'jpg'],
                default: 'png',
                description: 'Image format'
              }
            }
          }
        },
        {
          name: 'capture_area',
          description: 'Capture a specific area of the screen',
          inputSchema: {
            type: 'object',
            properties: {
              x: { type: 'number', description: 'X coordinate' },
              y: { type: 'number', description: 'Y coordinate' },
              width: { type: 'number', description: 'Width of area' },
              height: { type: 'number', description: 'Height of area' },
              output_path: { type: 'string', description: 'Optional save path' }
            },
            required: ['x', 'y', 'width', 'height']
          }
        },
        {
          name: 'open_browser',
          description: 'Open a browser window with Puppeteer',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to navigate to'
              },
              headless: {
                type: 'boolean',
                default: false,
                description: 'Run in headless mode'
              }
            },
            required: ['url']
          }
        },
        {
          name: 'browser_screenshot',
          description: 'Take a screenshot of the current browser page',
          inputSchema: {
            type: 'object',
            properties: {
              fullPage: {
                type: 'boolean',
                default: true,
                description: 'Capture full page or just viewport'
              },
              output_path: {
                type: 'string',
                description: 'Optional path to save screenshot'
              }
            }
          }
        },
        {
          name: 'click_element',
          description: 'Click an element in the browser by selector',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector of element to click'
              },
              wait: {
                type: 'boolean',
                default: true,
                description: 'Wait for element to be visible'
              }
            },
            required: ['selector']
          }
        },
        {
          name: 'type_text',
          description: 'Type text into an input field',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector of input field'
              },
              text: {
                type: 'string',
                description: 'Text to type'
              },
              clear: {
                type: 'boolean',
                default: true,
                description: 'Clear field before typing'
              }
            },
            required: ['selector', 'text']
          }
        },
        {
          name: 'get_page_content',
          description: 'Get text content or HTML from the current page',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector to get content from (optional, defaults to body)'
              },
              type: {
                type: 'string',
                enum: ['text', 'html'],
                default: 'text',
                description: 'Type of content to retrieve'
              }
            }
          }
        },
        {
          name: 'close_browser',
          description: 'Close the browser instance',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'take_screenshot':
            return await this.takeScreenshot(args);
          
          case 'capture_area':
            return await this.captureArea(args);
          
          case 'open_browser':
            return await this.openBrowser(args);
          
          case 'browser_screenshot':
            return await this.browserScreenshot(args);
          
          case 'click_element':
            return await this.clickElement(args);
          
          case 'type_text':
            return await this.typeText(args);
          
          case 'get_page_content':
            return await this.getPageContent(args);
          
          case 'close_browser':
            return await this.closeBrowser();
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async takeScreenshot(args) {
    const { output_path, format = 'png' } = args;
    
    try {
      const imgBuffer = await screenshot({ format });
      
      let savedPath = output_path;
      if (!savedPath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        savedPath = path.join(os.tmpdir(), `screenshot-${timestamp}.${format}`);
      }
      
      await fs.writeFile(savedPath, imgBuffer);
      
      // Convert to base64 for viewing in Claude
      const base64 = imgBuffer.toString('base64');
      
      return {
        content: [
          {
            type: 'text',
            text: `Screenshot saved to: ${savedPath}`
          },
          {
            type: 'image',
            data: base64,
            mimeType: `image/${format}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to take screenshot: ${error.message}`);
    }
  }

  async captureArea(args) {
    const { x, y, width, height, output_path } = args;
    
    try {
      // Take full screenshot first
      const imgBuffer = await screenshot({ format: 'png' });
      
      // Crop to specified area
      const croppedBuffer = await sharp(imgBuffer)
        .extract({ left: x, top: y, width, height })
        .toBuffer();
      
      let savedPath = output_path;
      if (!savedPath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        savedPath = path.join(os.tmpdir(), `screenshot-area-${timestamp}.png`);
      }
      
      await fs.writeFile(savedPath, croppedBuffer);
      
      const base64 = croppedBuffer.toString('base64');
      
      return {
        content: [
          {
            type: 'text',
            text: `Area screenshot saved to: ${savedPath}`
          },
          {
            type: 'image',
            data: base64,
            mimeType: 'image/png'
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to capture area: ${error.message}`);
    }
  }

  async openBrowser(args) {
    const { url, headless = false } = args;
    
    try {
      if (browser) {
        await browser.close();
      }
      
      browser = await puppeteer.launch({
        headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      return {
        content: [
          {
            type: 'text',
            text: `Browser opened and navigated to: ${url}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to open browser: ${error.message}`);
    }
  }

  async browserScreenshot(args) {
    const { fullPage = true, output_path } = args;
    
    if (!page) {
      throw new Error('No browser page open. Use open_browser first.');
    }
    
    try {
      let savedPath = output_path;
      if (!savedPath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        savedPath = path.join(os.tmpdir(), `browser-screenshot-${timestamp}.png`);
      }
      
      const screenshot = await page.screenshot({ 
        fullPage,
        path: savedPath 
      });
      
      const base64 = screenshot.toString('base64');
      
      return {
        content: [
          {
            type: 'text',
            text: `Browser screenshot saved to: ${savedPath}`
          },
          {
            type: 'image',
            data: base64,
            mimeType: 'image/png'
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to take browser screenshot: ${error.message}`);
    }
  }

  async clickElement(args) {
    const { selector, wait = true } = args;
    
    if (!page) {
      throw new Error('No browser page open. Use open_browser first.');
    }
    
    try {
      if (wait) {
        await page.waitForSelector(selector, { visible: true });
      }
      await page.click(selector);
      
      return {
        content: [
          {
            type: 'text',
            text: `Clicked element: ${selector}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to click element: ${error.message}`);
    }
  }

  async typeText(args) {
    const { selector, text, clear = true } = args;
    
    if (!page) {
      throw new Error('No browser page open. Use open_browser first.');
    }
    
    try {
      await page.waitForSelector(selector, { visible: true });
      
      if (clear) {
        await page.click(selector, { clickCount: 3 }); // Select all
      }
      
      await page.type(selector, text);
      
      return {
        content: [
          {
            type: 'text',
            text: `Typed text into: ${selector}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to type text: ${error.message}`);
    }
  }

  async getPageContent(args) {
    const { selector = 'body', type = 'text' } = args;
    
    if (!page) {
      throw new Error('No browser page open. Use open_browser first.');
    }
    
    try {
      const content = await page.evaluate((sel, contentType) => {
        const element = document.querySelector(sel);
        if (!element) return null;
        return contentType === 'text' ? element.textContent : element.innerHTML;
      }, selector, type);
      
      if (!content) {
        throw new Error(`Element not found: ${selector}`);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: content
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to get page content: ${error.message}`);
    }
  }

  async closeBrowser() {
    if (browser) {
      await browser.close();
      browser = null;
      page = null;
      
      return {
        content: [
          {
            type: 'text',
            text: 'Browser closed successfully'
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: 'No browser instance to close'
          }
        ]
      };
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Desktop Commander Extended MCP server started');
  }
}

// Start the server
const server = new DesktopCommanderExtended();
server.start().catch(console.error);