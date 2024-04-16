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
  const doc = createPDF();
  addTestResults(doc, results);
  addSummaryInfo(doc, results);
  addFooter(doc);
  return doc;
}

function createPDF(): jsPDF {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Resultado dos Testes', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  return doc;
}

function addTestResults(doc: jsPDF, results: INavigationResult[]): void {
  const resultsData = results.map(result => [
    result.title,
    result.message,
    result.duration || '',
    result.error || 'Sim',
  ]);
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
}

function addSummaryInfo(doc: jsPDF, results: INavigationResult[]): void {
  const totalDuration = results.reduce((total, result) => {
    if (typeof result.duration === 'number') {
      return total + result.duration;
    }
    return total;
  }, 0);
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.text(`Tempo total: ${totalDuration.toFixed(2)}s`, 14, finalY + 10);
  const totalTests = results.length;
  const totalPassedTests = calculatePassedTests(results);
  const testsPassedColor = totalPassedTests === totalTests ? 'green' : 'red';
  doc.setTextColor(testsPassedColor);
  doc.text(`Total de testes passados: ${totalPassedTests}/${totalTests}`, 14, finalY + 20);
  doc.setTextColor(100);
  const currentDate = new Date().toLocaleString();
  doc.text(`A exportação foi gerada em: ${currentDate}`, 14, finalY + 30);
}

function calculatePassedTests(results: INavigationResult[]): number {
  return results.filter(result => result.error === undefined).length;
}

function addFooter(doc: jsPDF): void {
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setFontSize(10);
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    doc.text(`Página ${i} de ${pageCount}`, 10, pageHeight - 8);
    doc.text(`Browse Buddy ${new Date().getFullYear()}`, pageSize.width - 40, pageHeight - 8);
  }
}
