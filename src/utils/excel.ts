import * as XLSX from 'xlsx';

export interface EmployeeImportData {
  nome: string;
  departamento: string;
  cargo: string;
  email: string;
  telefone: string;
  dataAdmissao: string;
  fimContrato?: string;
}

export function generateTemplate(): void {
  const headers = ['Nome', 'Departamento', 'Cargo', 'Email', 'Telefone', 'Data Admissão', 'Fim Contrato'];
  const sample = [
    ['João Silva', 'Tecnologia', 'Desenvolvedor', 'joao@empresa.ao', '+244 923 000 000', '2024-01-15', ''],
    ['Maria Santos', 'Recursos Humanos', 'Analista RH', 'maria@empresa.ao', '+244 924 000 000', '2023-06-01', ''],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');
  XLSX.writeFile(wb, 'modelo_importacao.xlsx');
}

export function parseExcelFile(file: File): Promise<EmployeeImportData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
        
        const employees: EmployeeImportData[] = json.map(row => ({
          nome: row['Nome'] || row['nome'] || '',
          departamento: row['Departamento'] || row['departamento'] || '',
          cargo: row['Cargo'] || row['cargo'] || '',
          email: row['Email'] || row['email'] || '',
          telefone: row['Telefone'] || row['telefone'] || '',
          dataAdmissao: row['Data Admissão'] || row['dataAdmissao'] || '',
          fimContrato: row['Fim Contrato'] || row['fimContrato'] || '',
        }));
        
        resolve(employees);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(data: Record<string, unknown>[], filename: string): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
