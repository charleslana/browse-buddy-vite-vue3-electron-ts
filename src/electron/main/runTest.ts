import { Core } from '../puppeteer/Core';
import { createI18nInstance } from '../i18n/i18n';
import { generateUUID } from '../utils/utils';
import { IAction } from '../interface/IAction';
import { INavigationResult } from '../interface/INavigationResult';
import { ipcMain } from 'electron';
import { IRunTest } from '../interface/IRunTest';
import { PageSingleton } from '../puppeteer/PageSingleton';

const core = new Core();

const navigationResults: INavigationResult[] = [];

let i18n = createI18nInstance();

export function handleRunTest(): void {
  ipcMain.handle('execute-run-test', async (event, runTestJSON: string) => {
    i18n = createI18nInstance();
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
  const t = i18n.global.t;
  const executionResult = await core.navigate(runTest.url, runTest.isSaveEveryScreenshot);
  navigationResults.push({
    action: 'navigate',
    title: t('navigateTo'),
    message: t('navigateMessage', [runTest.url]),
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
  const t = i18n.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.waitForClick(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-click',
    title: t('actionWaitClick'),
    message: t('waitClickMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClick(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = i18n.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.click(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'click',
    title: t('actionClick'),
    message: t('clickMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleFill(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = i18n.global.t;
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
    title: t('actionFill'),
    message: t('fillMessage', [secondInput.value, element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleType(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = i18n.global.t;
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
    title: t('actionType'),
    message: t('typeMessage', [secondInput.value, element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClear(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = i18n.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.clear(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'clear',
    title: t('actionClear'),
    message: t('clearMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleWaitVisible(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = i18n.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.waitForVisible(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-visible',
    title: t('actionWaitVisible'),
    message: t('waitVisibleMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleWaitHidden(action: IAction, isSaveEveryScreenshot?: boolean): Promise<void> {
  const t = i18n.global.t;
  const input = action.inputs[0];
  const element = `${input.select}${input.value}`;
  const executionResult = await core.waitForHidden(element, action.id, isSaveEveryScreenshot);
  navigationResults.push({
    action: 'wait-hidden',
    title: t('actionWaitHidden'),
    message: t('waitHiddenMessage', [element]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function handleClickWaitResponse(
  action: IAction,
  isSaveEveryScreenshot?: boolean
): Promise<void> {
  const t = i18n.global.t;
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
    title: t('actionClickWaitResponse'),
    message: t('clickWaitResponseMessage', [element, urlPattern]),
    screenshot: executionResult.screenshot,
    duration: parseFloat(executionResult.duration.toFixed(2)),
    error: executionResult.error,
  });
}

async function finish(isSaveLastScreenshot: boolean): Promise<void> {
  const t = i18n.global.t;
  let screenshot: string | undefined;
  if (isSaveLastScreenshot) {
    screenshot = await core.screenshot(generateUUID());
  }
  navigationResults.push({
    action: 'end',
    title: t('testCycleTitle'),
    message: t('testCycleMessage'),
    screenshot: screenshot,
  });
}
