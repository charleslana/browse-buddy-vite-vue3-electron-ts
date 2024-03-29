import { ipcMain } from 'electron';
import { IRunTest } from '../interface/IRunTest';

export function handleRunTest(): void {
  ipcMain.handle('execute-run-test', async (event, runTestJSON: string) => {
    try {
      const runTest: IRunTest = JSON.parse(runTestJSON);
      console.log('Objeto runTest recebido:', runTest);
      const result = await runTestFunction(runTest);
      event.sender.send('execute-run-test-result', result);
      return result;
    } catch (error) {
      console.error('Erro ao executar teste:', error);
      throw error;
    }
  });
}

async function runTestFunction(runTest: IRunTest) {
  console.log(runTest);
  return 'Resultado do teste';
}
