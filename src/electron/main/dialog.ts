import fs from 'fs';
import logger from '../utils/logger';
import { app, dialog, ipcMain } from 'electron';
import { IRunTest } from '../interface/IRunTest';

export function handleSaveTestToFile(): void {
  ipcMain.handle('dialog:save-file', (_event, data: string) => saveTestToFile(data));
}

export function handleOpenTestFile(): void {
  ipcMain.handle('dialog:open-file', openFile);
}

function saveTestToFile(jsonData: string): void {
  const defaultPath = app.getPath('downloads');
  const runTest: IRunTest = JSON.parse(jsonData);
  const filePath = dialog.showSaveDialogSync({
    title: runTest.name,
    defaultPath: `${defaultPath}/${runTest.name}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (filePath && filePath.length > 0) {
    fs.writeFileSync(filePath, jsonData, { encoding: 'utf-8' });
    logger.info('Teste salvo com sucesso em:', filePath);
  } else {
    logger.info('Nenhum arquivo selecionado ou operação cancelada.');
  }
}

function openFile(): string | undefined {
  const defaultPath = app.getPath('downloads');
  const filePaths = dialog.showOpenDialogSync({
    title: 'Abrir Arquivo',
    defaultPath: defaultPath,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];
    try {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      return fileData;
    } catch (error) {
      logger.error('Erro ao abrir arquivo:', error);
      return undefined;
    }
  } else {
    return undefined;
  }
}
