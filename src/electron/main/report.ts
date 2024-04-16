import autoTable from 'jspdf-autotable';
import fs from 'fs';
import jsPDF from 'jspdf';
import logger from '../utils/logger';
import { app, dialog, ipcMain } from 'electron';
import { generateDateTime } from '../utils/utils';
import { INavigationResult } from '../interface/INavigationResult';

export function handleSaveReport(): void {
  ipcMain.handle('dialog:save-report', (_event, data: string) => saveReport(data));
}

async function saveReport(jsonData: string): Promise<void> {
  const defaultPath = app.getPath('downloads');
  const results: INavigationResult[] = JSON.parse(jsonData);
  const doc = await generateDocument(results);
  const name = generateDateTime();
  const filePath = dialog.showSaveDialogSync({
    title: name,
    defaultPath: `${defaultPath}/${name}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (filePath && filePath.length > 0) {
    fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
    logger.info('Relatório salvo com sucesso em:', filePath);
  } else {
    logger.info('Nenhum arquivo selecionado ou operação cancelada.');
  }
}

async function generateDocument(results: INavigationResult[]): Promise<jsPDF> {
  const resultsData = results.map(result => [
    result.title,
    result.message,
    result.duration || '',
    result.error || 'Sim',
  ]);
  const totalDuration = results.reduce((total, result) => {
    if (typeof result.duration === 'number') {
      return total + result.duration;
    }
    return total;
  }, 0);
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Resultado dos Testes', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  autoTable(doc, {
    startY: 35,
    headStyles: {
      fillColor: [128, 128, 128],
    },
    columnStyles: { 0: { halign: 'center' } },
    head: [['Ação', 'Mensagem', 'Tempo de duração (segundos)', 'Passou']],
    body: resultsData,
    didParseCell: data => {
      if (data.section === 'body' && data.column.index === 3) {
        const raw = (data.row.raw as any)[data.column.index];
        data.cell.styles.textColor = raw === 'Sim' ? 'green' : 'red';
      }
    },
  });
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.text(`Tempo total: ${totalDuration.toFixed(2)}s`, 14, finalY + 10);
  const currentDate = new Date().toLocaleString();
  doc.text(`A exportação foi gerada em: ${currentDate}`, 14, finalY + 20);
  return doc;
}
