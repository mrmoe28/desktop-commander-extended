#!/usr/bin/env node
import { program } from 'commander';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { takeScreenshot, captureArea, isSharpAvailable } from './lib/screenshot-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global browser instance
let browser = null;
let page = null;

class DesktopCommanderCLI {
  constructor() {
    this.setupCommands();
  }

  setupCommands() {
    program
      .name('desktop-commander')
      .description('Desktop interaction tool with screenshot and browser automation capabilities')
      .version('1.0.0');

    // Screenshot command
    program
      .command('screenshot')
      .description('Take a screenshot of the entire screen')
      .option('-o, --output <path>', 'Output path for the screenshot')
      .option('-f, --format <format>', 'Image format (png or jpg)', 'png')
      .action(async (options) => {
        await this.takeScreenshot(options);
      });

    // Capture area command
    program
      .command('capture-area')
      .description('Capture a specific area of the screen')
      .requiredOption('-x, --x <number>', 'X coordinate', parseInt)
      .requiredOption('-y, --y <number>', 'Y coordinate', parseInt)
      .requiredOption('-w, --width <number>', 'Width of area', parseInt)
      .requiredOption('-h, --height <number>', 'Height of area', parseInt)
      .option('-o, --output <path>', 'Output path for the screenshot')
      .action(async (options) => {
        await this.captureArea(options);
      });

    // Browser commands
    program
      .command('browser')
      .description('Browser automation commands')
      .action(async () => {
        await this.browserInteractiveMode();
      });

    // Direct browser commands
    program
      .command('browse <url>')
      .description('Open a URL in the browser')
      .option('--headless', 'Run in headless mode')
      .action(async (url, options) => {
        await this.openBrowser({ url, headless: options.headless });
      });

    program
      .command('browser-screenshot')
      .description('Take a screenshot of the current browser page')
      .option('-o, --output <path>', 'Output path for the screenshot')
      .option('--full-page', 'Capture full page', true)
      .action(async (options) => {
        await this.browserScreenshot(options);
      });

    // Interactive mode
    program
      .command('interactive')
      .description('Start interactive mode')
      .action(async () => {
        await this.interactiveMode();
      });

    program.parse();
  }

  async takeScreenshot(options) {
    const spinner = ora('Taking screenshot...').start();
    
    try {
      const result = await takeScreenshot({
        output_path: options.output || path.join(process.cwd(), `screenshot-${new Date().toISOString().replace(/[:.]/g, '-')}.${options.format}`),
        format: options.format
      });
      
      spinner.succeed(chalk.green(`Screenshot saved to: ${result.savedPath}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to take screenshot: ${error.message}`));
      process.exit(1);
    }
  }

  async captureArea(options) {
    const spinner = ora('Capturing area...').start();
    
    try {
      const result = await captureArea({
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        output_path: options.output || path.join(process.cwd(), `screenshot-area-${new Date().toISOString().replace(/[:.]/g, '-')}.png`)
      });
      
      spinner.succeed(chalk.green(`Area screenshot saved to: ${result.savedPath}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to capture area: ${error.message}`));
      if (error.message.includes('Sharp module')) {
        console.log(chalk.yellow('\n💡 Tip: Run "npm run fix-sharp" to enable area capture functionality.'));
      }
      process.exit(1);
    }
  }

  async openBrowser(options) {
    const spinner = ora('Opening browser...').start();
    
    try {
      if (browser) {
        await browser.close();
      }
      
      browser = await puppeteer.launch({
        headless: options.headless || false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(options.url, { waitUntil: 'networkidle2' });
      
      spinner.succeed(chalk.green(`Browser opened and navigated to: ${options.url}`));
      
      if (!options.headless) {
        console.log(chalk.yellow('\nBrowser is now open. Use browser commands or interactive mode to control it.'));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to open browser: ${error.message}`));
      process.exit(1);
    }
  }

  async browserScreenshot(options) {
    if (!page) {
      console.error(chalk.red('No browser page open. Use "browse" command first.'));
      process.exit(1);
    }
    
    const spinner = ora('Taking browser screenshot...').start();
    
    try {
      let savedPath = options.output;
      if (!savedPath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        savedPath = path.join(process.cwd(), `browser-screenshot-${timestamp}.png`);
      }
      
      await page.screenshot({ 
        fullPage: options.fullPage,
        path: savedPath 
      });
      
      spinner.succeed(chalk.green(`Browser screenshot saved to: ${savedPath}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to take browser screenshot: ${error.message}`));
      process.exit(1);
    }
  }

  async browserInteractiveMode() {
    console.log(chalk.cyan('\n=== Browser Interactive Mode ===\n'));
    
    let continueLoop = true;
    
    while (continueLoop) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Open URL', value: 'open' },
            { name: 'Take screenshot', value: 'screenshot' },
            { name: 'Click element', value: 'click' },
            { name: 'Type text', value: 'type' },
            { name: 'Get page content', value: 'content' },
            { name: 'Close browser', value: 'close' },
            { name: 'Exit', value: 'exit' }
          ]
        }
      ]);

      switch (action) {
        case 'open':
          const { url, headless } = await inquirer.prompt([
            {
              type: 'input',
              name: 'url',
              message: 'Enter URL:',
              validate: input => input.length > 0
            },
            {
              type: 'confirm',
              name: 'headless',
              message: 'Run in headless mode?',
              default: false
            }
          ]);
          await this.openBrowser({ url, headless });
          break;

        case 'screenshot':
          if (!page) {
            console.error(chalk.red('No browser page open.'));
            break;
          }
          const { fullPage } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'fullPage',
              message: 'Capture full page?',
              default: true
            }
          ]);
          await this.browserScreenshot({ fullPage });
          break;

        case 'click':
          if (!page) {
            console.error(chalk.red('No browser page open.'));
            break;
          }
          const { selector } = await inquirer.prompt([
            {
              type: 'input',
              name: 'selector',
              message: 'Enter CSS selector:',
              validate: input => input.length > 0
            }
          ]);
          try {
            await page.waitForSelector(selector, { visible: true });
            await page.click(selector);
            console.log(chalk.green(`Clicked element: ${selector}`));
          } catch (error) {
            console.error(chalk.red(`Failed to click: ${error.message}`));
          }
          break;

        case 'type':
          if (!page) {
            console.error(chalk.red('No browser page open.'));
            break;
          }
          const typeAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'selector',
              message: 'Enter CSS selector:',
              validate: input => input.length > 0
            },
            {
              type: 'input',
              name: 'text',
              message: 'Enter text to type:',
              validate: input => input.length > 0
            }
          ]);
          try {
            await page.waitForSelector(typeAnswers.selector, { visible: true });
            await page.click(typeAnswers.selector, { clickCount: 3 });
            await page.type(typeAnswers.selector, typeAnswers.text);
            console.log(chalk.green(`Typed text into: ${typeAnswers.selector}`));
          } catch (error) {
            console.error(chalk.red(`Failed to type: ${error.message}`));
          }
          break;

        case 'content':
          if (!page) {
            console.error(chalk.red('No browser page open.'));
            break;
          }
          const { contentSelector } = await inquirer.prompt([
            {
              type: 'input',
              name: 'contentSelector',
              message: 'Enter CSS selector (leave empty for body):',
              default: 'body'
            }
          ]);
          try {
            const content = await page.evaluate((sel) => {
              const element = document.querySelector(sel);
              return element ? element.textContent : null;
            }, contentSelector);
            console.log(chalk.cyan('\nPage content:'));
            console.log(content);
          } catch (error) {
            console.error(chalk.red(`Failed to get content: ${error.message}`));
          }
          break;

        case 'close':
          if (browser) {
            await browser.close();
            browser = null;
            page = null;
            console.log(chalk.green('Browser closed.'));
          }
          break;

        case 'exit':
          if (browser) {
            await browser.close();
          }
          continueLoop = false;
          break;
      }
    }
  }

  async interactiveMode() {
    console.log(chalk.cyan('\n=== Desktop Commander Interactive Mode ===\n'));
    
    let continueLoop = true;
    
    while (continueLoop) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Take screenshot', value: 'screenshot' },
            { name: 'Capture screen area', value: 'capture' },
            { name: 'Browser automation', value: 'browser' },
            { name: 'Exit', value: 'exit' }
          ]
        }
      ]);

      switch (action) {
        case 'screenshot':
          await this.takeScreenshot({});
          break;
          
        case 'capture':
          const areaAnswers = await inquirer.prompt([
            {
              type: 'number',
              name: 'x',
              message: 'Enter X coordinate:',
              validate: input => !isNaN(input)
            },
            {
              type: 'number',
              name: 'y',
              message: 'Enter Y coordinate:',
              validate: input => !isNaN(input)
            },
            {
              type: 'number',
              name: 'width',
              message: 'Enter width:',
              validate: input => !isNaN(input) && input > 0
            },
            {
              type: 'number',
              name: 'height',
              message: 'Enter height:',
              validate: input => !isNaN(input) && input > 0
            }
          ]);
          await this.captureArea(areaAnswers);
          break;
          
        case 'browser':
          await this.browserInteractiveMode();
          break;
          
        case 'exit':
          continueLoop = false;
          if (browser) {
            await browser.close();
          }
          console.log(chalk.cyan('\nGoodbye!'));
          break;
      }
    }
    
    process.exit(0);
  }
}

// Start the CLI
const cli = new DesktopCommanderCLI();

// Handle cleanup on exit
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});