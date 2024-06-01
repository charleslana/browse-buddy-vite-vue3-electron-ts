import fs from 'fs';
import logger from '../utils/logger';
import path from 'path';
import { createI18nInstance } from '../i18n/i18n';
import { generateUUID } from '../utils/utils';
import { IExecutionResult } from '../interface/IExecutionResult';
import { Page } from 'puppeteer';
import { PageSingleton } from './PageSingleton';

class CoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoreError';
  }
}

export class Core {
  public pageSingleton = PageSingleton.getInstance();

  private _page: Page | null = null;
  private i18n = createI18nInstance();
  private t = this.i18n.global.t;

  public async navigate(url: string, saveScreenshot?: boolean): Promise<IExecutionResult> {
    this.i18n = createI18nInstance();
    this.t = this.i18n.global.t;
    logger.warn(`Tentando navegar para ${url} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.createPage();
      await this.getPage().goto(url, {
        waitUntil: 'domcontentloaded',
      });
      logger.info(`Sucesso ao navegar para ${url}`);
    } catch (e) {
      error = this.t('navigateError', [url]);
      logger.error(`Erro ao navegar para ${url}: ${e}`);
    } finally {
      if (!error) {
        screenshot = await this.saveScreenshot(generateUUID(), saveScreenshot);
      }
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async waitForClick(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando aguardar e clicar no elemento com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      const result = await this.waitForVisible(selector, id, saveScreenshot);
      error = result.error;
      await this.getPage().click(selector);
      logger.info(`Sucesso ao aguardar e clicar no elemento com seletor ${selector}`);
    } catch (e) {
      error += this.t('waitForClickError', [selector]);
      logger.error(`Erro ao aguardar e clicar no elemento com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async click(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando clicar no elemento com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.getPage().click(selector);
      logger.info(`Sucesso ao clicar no elemento com seletor ${selector}`);
    } catch (e) {
      error = this.t('clickError', [selector]);
      logger.error(`Erro ao clicar no elemento com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async fill(
    selector: string,
    text: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando preencher o texto ${text} no seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.getPage().locator(selector).fill(text);
      logger.info(`Sucesso ao preencher o texto ${text} no seletor ${selector}`);
    } catch (e) {
      error = this.t('fillError', [text, selector]);
      logger.error(`Erro ao preencher o texto ${text} no seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async type(
    selector: string,
    text: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando digitar o texto ${text} no seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.getPage().type(selector, text);
      logger.info(`Sucesso ao digitar o texto ${text} no seletor ${selector}`);
    } catch (e) {
      error = this.t('typeError', [text, selector]);
      logger.error(`Erro ao digitar o texto ${text} no seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async clear(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando limpar o texto no seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.getPage().click(selector, { count: 3 });
      await this.getPage().keyboard.press('Backspace');
      logger.info(`Sucesso ao limpar o texto no seletor ${selector}`);
    } catch (e) {
      error = this.t('clearError', [selector]);
      logger.error(`Erro ao limpar o texto no seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async waitForVisible(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando aguardar elemento visível com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.getPage().waitForSelector(selector, { visible: true });
      logger.info(`Sucesso ao esperar o seletor ${selector} visível`);
    } catch (e) {
      error = this.t('waitVisibleError', [selector]);
      logger.error(`Erro ao aguardar elemento visível com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async waitForHidden(
    selector: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando aguardar elemento oculto com seletor ${selector} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.getPage().waitForSelector(selector, { hidden: true });
      logger.info(`Sucesso ao esperar o seletor ${selector} oculto`);
    } catch (e) {
      error = this.t('waitHiddenError', [selector]);
      logger.error(`Erro ao aguardar elemento oculto com seletor ${selector}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async clickWaitForResponse(
    selector: string,
    urlPattern: string,
    id: string,
    saveScreenshot?: boolean
  ): Promise<IExecutionResult> {
    logger.warn(`Tentando aguardar a resposta com a url ${urlPattern} ...`);
    let screenshot: string | undefined;
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      const regexPattern = new RegExp(urlPattern.replace(/\*\*/g, '.*?'));
      const finalResponsePromise = this.getPage().waitForResponse(response =>
        regexPattern.test(response.url())
      );
      await this.click(selector, id, saveScreenshot);
      const finalResponse = await finalResponsePromise;
      logger.info(`Sucesso aguardar a resposta com a url ${urlPattern}: ${finalResponse.ok()}`);
    } catch (e) {
      error = this.t('clickWaitResponseError', [urlPattern]);
      logger.error(`Erro ao aguardar a resposta com a url ${urlPattern}: ${e}`);
    } finally {
      screenshot = await this.saveScreenshot(id, saveScreenshot);
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
    }
    return { screenshot, duration, error };
  }

  public async screenshot(name: string): Promise<string> {
    logger.warn(`Tentando salvar tela de captura ${name} ...`);
    try {
      const screenshotsDir = this.getScreenshotDir();
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      const screenshotPath = path.resolve(screenshotsDir, `${name}.png`);
      await this.getPage().screenshot({
        path: path.resolve(screenshotsDir, `${name}.png`),
      });
      const buffer = fs.readFileSync(screenshotPath);
      const base64Image = this.bufferToBase64(buffer);
      logger.info(`Sucesso ao salvar tela de captura ${name}`);
      return base64Image;
    } catch (error) {
      logger.error(`Erro ao salvar tela de captura: ${error}`);
      throw new CoreError(`Erro ao salvar tela de captura: ${error}`);
    }
  }

  public async closeBrowser(): Promise<void> {
    try {
      await this.pageSingleton.closeBrowser();
    } catch (error) {
      throw new CoreError(`Erro ao fechar o navegador: ${error}`);
    }
  }

  private async saveScreenshot(id: string, saveScreenshot?: boolean): Promise<string | undefined> {
    if (saveScreenshot) {
      return await this.screenshot(id);
    }
  }

  private async createPage(): Promise<void> {
    this._page = await this.pageSingleton.getPage();
  }

  private getPage(): Page {
    return this._page!;
  }

  private getScreenshotDir(): string {
    if (process.platform === 'linux') {
      return path.join(process.env.HOME || '', '.config', 'browse-buddy', 'screenshots');
    } else if (process.platform === 'win32') {
      return path.join(process.env.APPDATA || '', 'browse-buddy', 'screenshots');
    }
    throw new CoreError(`Sistema operacional não suportado: ${process.platform}`);
  }

  private bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }
}
