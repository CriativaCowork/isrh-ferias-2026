// Department and absence type colors
export const DEPARTMENT_COLORS: Record<string, string> = {
  'Recursos Humanos': '#10b981',
  'Tecnologia': '#3b82f6',
  'Financeiro': '#8b5cf6',
  'Comercial': '#f59e0b',
  'Jurídico': '#ef4444',
  'Marketing': '#ec4899',
  'Operações': '#06b6d4',
  'Administração': '#6366f1',
};

export const ABSENCE_COLORS: Record<string, string> = {
  'Férias': '#10b981',
  'Maternidade': '#ec4899',
  'Paternidade': '#3b82f6',
  'Licença Médica': '#6366f1',
  'Falecimento': '#6b7280',
  'Casamento': '#f59e0b',
  'Falta Justificada': '#14b8a6',
  'Falta Injustificada': '#ef4444',
  'Formação': '#8b5cf6',
  'Outro': '#94a3b8',
};

export function getDepartmentColor(dept: string): string {
  return DEPARTMENT_COLORS[dept] || '#6b7280';
}

export function getAbsenceColor(type: string): string {
  return ABSENCE_COLORS[type] || '#94a3b8';
}

export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 55%)`;
}
