import { Core } from '../puppeteer/Core';
import { generateUUID } from '../utils/utils';
import { IAction } from '../interface/IAction';
import { INavigationResult } from '../interface/INavigationResult';
import { ipcMain } from 'electron';
import { IRunTest } from '../interface/IRunTest';

const core = new Core();

const navigationResults: INavigationResult[] = [];

export function handleRunTest(): void {
  ipcMain.handle('execute-run-test', async (event, runTestJSON: string) => {
    try {
      const runTest: IRunTest = JSON.parse(runTestJSON);
      const result = await runTestFunction(runTest);
      event.sender.send('execute-run-test-result', result);
      return result;
    } catch (error) {
      event.sender.send('execute-run-test-error', error);
      throw error;
    } finally {
      navigationResults.length = 0;
    }
  });
}

async function runTestFunction(runTest: IRunTest): Promise<INavigationResult[]> {
  core.pageSingleton.setHeadless(runTest.isHeadless);
  await navigate(runTest);
  await handleActions(runTest.actions, runTest.isSaveEveryScreenshot);
  await closeBrowser(runTest.isSaveLastScreenshot);
  const resultsToReturn = navigationResults.slice();
  return resultsToReturn;
}

async function navigate(runTest: IRunTest) {
  const navigate = await core.navigate(runTest.url, runTest.isSaveEveryScreenshot);
  navigationResults.push({
    action: 'navigate',
    title: 'Navegar para',
    message: `Navegação para url: ${runTest.url} com sucesso`,
    screenshot: navigate.screenshot,
    duration: parseFloat(navigate.duration.toFixed(2)),
  });
}

async function handleActions(actions: IAction[], isSaveEveryScreenshot?: boolean): Promise<void> {
  for (const action of actions) {
    switch (action.action) {
      case 'wait-click':
        await handleWaitClick(action, isSaveEveryScreenshot);
        break;
      case 'click':
        await handleClick(action, isSaveEveryScreenshot);
        break;
      default:
        break;
    }
  }
}

async function handleWaitClick(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const element = `${action.elementType}${action.element}`;
  const waitForClick = await core.waitForClick(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-click',
    title: 'Esperar e Clicar',
    message: `Aguardar e clicar no elemento: ${element} com sucesso`,
    screenshot: waitForClick.screenshot,
    duration: parseFloat(waitForClick.duration.toFixed(2)),
  });
}

async function handleClick(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const element = `${action.elementType}${action.element}`;
  const click = await core.click(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'click',
    title: 'Clicar',
    message: `Clicar no elemento: ${element} com sucesso`,
    screenshot: click.screenshot,
    duration: parseFloat(click.duration.toFixed(2)),
  });
}

async function closeBrowser(isSaveLastScreenshot: boolean): Promise<void> {
  let screenshot: string | undefined;
  if (isSaveLastScreenshot) {
    screenshot = await core.screenshot(`close-${generateUUID()}`);
  }
  navigationResults.push({
    action: 'end',
    title: 'Ciclo do teste',
    message: `Fim da execução`,
    screenshot: screenshot,
  });
  await core.closeBrowser();
}
