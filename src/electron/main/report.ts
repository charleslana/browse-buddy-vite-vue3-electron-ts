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
  doc.addImage(`data:image/png;base64,${icon}`, 'PNG', doc.internal.pageSize.width - 25, 5, 20, 20);
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
    head: [['Ação', 'Contexto', 'Tempo de duração (segundos)', 'Passou']],
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

const icon =
  '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OnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6MmQ0ZWI3NDEtMGVmNS00MDJhLTg1OGItOTA5Mzk0MzczZTc4IgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYyNjRkYjZiLTk1OTYtNGRjNC04OWIyLTZlMjBlOWFmNzZlYiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjUxODI5MGE5LTNhOWQtNDExMS05MTRjLTc1ODZlNTJkODMzNSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTcxNjczNDU0NDgwOTI1MCIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjMwIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJjOGJmYzU5LWZjNDQtNDVhMC1iZGRhLWY1ODI1MTE1ZjA2MSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjQtMDUtMjZUMTA6NTk6MDQtMDM6MDAiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTA3OTRjMTAtNjA4MS00ODQ0LWFjMWMtNWYyMDgyYjFiNmFkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKExpbnV4KSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wNS0yNlQxMTo0MjoyNC0wMzowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6Bw/pEAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH6AUaDioYtx5ysAAACPJJREFUeNrtmntUVNcVxn8zwyAveQQUERFRgSAKRkEIooIRH9WiRqlWC6lVY01dGmxXrNZGLTWxJppqiUoaW5dWrCVRsTaRZQRUJIrvoChGQFFBqYqCIO/pH5w7zJAZGKL4SO+31l3ce2afffbe9zy+vS8gQ4YMGTJkyJAhQ4YMGTKeLpKS0/okJaf1eZY2KJ6l88AF8egbNT4851nYYfYUHHUEwoEvo8aHV+j85GDknqTkNGtgDJAWNT78bnvap3wKQd4DJAE729Bnp+izp72NMzUA5oAzYPU9xngk/o5NSk4bpdOeA2SIK0fn7Y8Cxjbr2xZYCVvNH3cJWAFvAtOB/kJWA3wL7ALWAbdMGGM5ECHuA4EUgKjx4aXAEAPygc36moIuwALgdcBT7G11wFlgO/BXoKItUQwGCoTDxq4HwM9M3AdikpLT1iUlp7mYIOsiZGNMtHW6sKUlW68Kn0w6BYaIt2QJMOv1CCLDg7G3taHyUTVHz1wgLkG7nDXAr4CNz+gwmQt8LPnx+zlTGPyKL1aWHbhf9pC9acf4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';
