import { Core } from '../puppeteer/Core';
import { generateUUID } from '../utils/utils';
import { IAction } from '../interface/IAction';
import { INavigationResult } from '../interface/INavigationResult';
import { ipcMain } from 'electron';
import { IRunTest } from '../interface/IRunTest';
import { PageSingleton } from '../puppeteer/PageSingleton';

const core = new Core();

const navigationResults: INavigationResult[] = [];

export function handleRunTest(): void {
  ipcMain.handle('execute-run-test', async (event, runTestJSON: string) => {
    const runTest: IRunTest = JSON.parse(runTestJSON);
    PageSingleton.setHeadless(runTest.isHeadless);
    PageSingleton.setDefaultTimeout(runTest.defaultTimeout);
    const result = await runTestFunction(runTest);
    await core.closeBrowser();
    navigationResults.length = 0;
    event.sender.send('execute-run-test-result', result);
  });
}

async function runTestFunction(runTest: IRunTest): Promise<INavigationResult[]> {
  await navigate(runTest);
  await handleActions(runTest.actions, runTest.isSaveEveryScreenshot);
  await finish(runTest.isSaveLastScreenshot);
  const resultsToReturn = navigationResults.slice();
  return resultsToReturn;
}

async function navigate(runTest: IRunTest) {
  const executionResult = await core.navigate(runTest.url, runTest.isSaveEveryScreenshot);
  navigationResults.push({
    action: 'navigate',
    title: 'Navegar para',
    message: `Navegação para url: ${runTest.url}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleActions(actions: IAction[], isSaveEveryScreenshot?: boolean): Promise<void> {
  for (const action of actions) {
    switch (action.type) {
      case 'wait-click':
        await handleWaitClick(action, isSaveEveryScreenshot);
        break;
      case 'click':
        await handleClick(action, isSaveEveryScreenshot);
        break;
      case 'fill':
        await handleFill(action, isSaveEveryScreenshot);
        break;
      case 'type':
        await handleType(action, isSaveEveryScreenshot);
        break;
      case 'clear':
        await handleClear(action, isSaveEveryScreenshot);
        break;
      case 'wait-visible':
        await handleWaitVisible(action, isSaveEveryScreenshot);
        break;
      case 'wait-hidden':
        await handleWaitHidden(action, isSaveEveryScreenshot);
        break;
      case 'click-wait-response':
        await handleClickWaitResponse(action, isSaveEveryScreenshot);
        break;
      default:
        break;
    }
  }
}

async function handleWaitClick(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.waitForClick(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-click',
    title: 'Esperar e Clicar',
    message: `Aguardar e clicar no elemento: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClick(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.click(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'click',
    title: 'Clicar',
    message: `Clicar no elemento: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleFill(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const secondInput = action.inputs[1];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.fill(
    element,
    secondInput.value!,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'fill',
    title: 'Preencher',
    message: `Preencher o texto: ${secondInput.value}\nCom o elemento: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleType(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const secondInput = action.inputs[1];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.type(
    element,
    secondInput.value!,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'type',
    title: 'Digitar',
    message: `Digitar o texto: ${secondInput.value}\nCom o elemento: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClear(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.clear(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'clear',
    title: 'Limpar',
    message: `Limpar o texto com o elemento: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleWaitVisible(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.waitForVisible(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-visible',
    title: 'Esperar visibilidade',
    message: `Esperar o elemento visível: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleWaitHidden(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.waitForHidden(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-hidden',
    title: 'Esperar ocultar',
    message: `Esperar o elemento oculto: ${element}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClickWaitResponse(
  action: IAction,
  isSaveEveryScreenshot?: boolean
): Promise<void> {
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const urlPattern = `${action.inputs[1].value}`;
  const executionResult = await core.clickWaitForResponse(
    element,
    urlPattern,
    action.id,
    isSaveEveryScreenshot
  );
  navigationResults.push({
    action: 'click-wait-response',
    title: 'Esperar resposta com clique',
    message: `Clicar no elemento: ${element} e esperar a resposta com a url: ${urlPattern}`,
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function finish(isSaveLastScreenshot: boolean): Promise<void> {
  let screenshot: string | undefined;
  if (isSaveLastScreenshot) {
    screenshot = await core.screenshot(generateUUID());
  }
  navigationResults.push({
    action: 'end',
    title: 'Ciclo do teste',
    message: `Fim da execução`,
    screenshot: screenshot,
  });
}
