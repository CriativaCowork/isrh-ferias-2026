import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFOptions {
  title?: string;
  subtitle?: string;
  adminName?: string;
  institution?: string;
}

export function createPDF(options: PDFOptions): jsPDF {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ISRH Mapa de Férias', pageWidth / 2, 15, { align: 'center' });
  
  if (options.title) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(options.title, pageWidth / 2, 22, { align: 'center' });
  }
  
  if (options.subtitle) {
    doc.setFontSize(10);
    doc.text(options.subtitle, pageWidth / 2, 28, { align: 'center' });
  }
  
  return doc;
}

export function addPDFFooter(doc: jsPDF, adminName?: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  
  const footerY = pageHeight - 10;
  doc.text(`ISRH Mapa de Férias — Lei Geral do Trabalho de Angola (Lei n.º 12/23)`, pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, pageWidth / 2, footerY + 4, { align: 'center' });
  
  if (adminName) {
    doc.text(`Responsável: ${adminName}`, pageWidth / 2, footerY + 8, { align: 'center' });
  }
  
  doc.setTextColor(0);
}

export function exportTablePDF(
  title: string,
  headers: string[],
  rows: string[][],
  options?: PDFOptions
): void {
  const doc = createPDF({ title, ...options });
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 253, 244] },
  });
  
  addPDFFooter(doc, options?.adminName);
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

export function exportVacationMapPDF(
  employees: Array<{ name: string; department: string; vacations: Array<{ start: string; end: string; type: string }> }>,
  year: number,
  adminName?: string
): void {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ISRH Mapa de Férias', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Mapa de Férias — ${year}`, pageWidth / 2, 19, { align: 'center' });
  
  // Table
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const headers = ['Colaborador', 'Departamento', ...months];
  
  const rows = employees.map(emp => {
    const row = [emp.name, emp.department];
    months.forEach((_, idx) => {
      const monthVacations = emp.vacations.filter(v => {
        const start = new Date(v.start);
        const end = new Date(v.end);
        const monthStart = new Date(year, idx, 1);
        const monthEnd = new Date(year, idx + 1, 0);
        return start <= monthEnd && end >= monthStart;
      });
      row.push(monthVacations.length > 0 ? `${monthVacations[0].type}` : '-');
    });
    return row;
  });
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 25,
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 7 },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 25 },
    },
  });
  
  addPDFFooter(doc, adminName);
  doc.save(`Mapa_Ferias_${year}.pdf`);
}
