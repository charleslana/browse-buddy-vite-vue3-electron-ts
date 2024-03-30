import dotenv from 'dotenv';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { app } from 'electron';

dotenv.config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.resolve(process.cwd(), '.env'),
});

export class PageSingleton {
  private static instance: PageSingleton;
  private page: Page | null = null;
  private browser: Browser | null = null;

  private constructor() {}

  public static getInstance(): PageSingleton {
    if (!PageSingleton.instance) {
      PageSingleton.instance = new PageSingleton();
    }
    return PageSingleton.instance;
  }

  public async getPage(): Promise<Page> {
    if (!this.page) {
      this.browser = await puppeteer.launch({
        executablePath: this.getExecutablePath(),
        headless: process.env.HEADLESS === 'true',
        defaultViewport: null,
        args: ['--no-sandbox'],
      });
      this.page = await this.browser.newPage();
      const getPages = await this.browser.pages();
      await getPages[0].close();
      this.page.setDefaultTimeout(Number(process.env.TIMEOUT));
      await this.page.setViewport({ width: 1920, height: 1080 });
    }
    return this.page;
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  private getExecutablePath(): string {
    const resourcesPackaged =
      process.platform === 'linux'
        ? path.join(process.resourcesPath, 'resources', 'chrome-linux', 'chrome')
        : process.platform === 'win32'
          ? path.join(process.resourcesPath, 'resources', 'chrome-win', 'chrome.exe')
          : '';
    return app.isPackaged ? resourcesPackaged : (process.env.EXEC as string);
  }
}
