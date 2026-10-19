import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Department {
  id: string;
  name: string;
  color: string;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
}

export interface Employee {
  id: string;
  name: string;
  departmentId: string;
  positionId: string;
  email: string;
  phone: string;
  hireDate: string;
  contractEnd?: string;
  avatar?: string;
  active: boolean;
}

export interface AbsenceType {
  id: string;
  name: string;
  color: string;
  maxDays?: number;
}

export interface Absence {
  id: string;
  employeeId: string;
  typeId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
}

export interface ComplianceAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  employeeId?: string;
  date: string;
  resolved: boolean;
}

export interface AdminProfile {
  name: string;
  role: string;
  institution: string;
}

export interface OrganizationInfo {
  name: string;
  nif: string;
}

export interface PDFDefaults {
  header: string;
  subtitle: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

interface AppState {
  departments: Department[];
  positions: Position[];
  employees: Employee[];
  absenceTypes: AbsenceType[];
  absences: Absence[];
  alerts: ComplianceAlert[];
  admin: AdminProfile;
  organization: OrganizationInfo;
  pdfDefaults: PDFDefaults;
  notifications: Notification[];
  darkMode: boolean;
  currentPage: string;
}

interface AppContextType extends AppState {
  // Departments
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  // Positions
  addPosition: (pos: Omit<Position, 'id'>) => void;
  updatePosition: (id: string, pos: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  // Employees
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  // Absence Types
  addAbsenceType: (type: Omit<AbsenceType, 'id'>) => void;
  updateAbsenceType: (id: string, type: Partial<AbsenceType>) => void;
  deleteAbsenceType: (id: string) => void;
  // Absences
  addAbsence: (abs: Omit<Absence, 'id' | 'createdAt'>) => void;
  updateAbsence: (id: string, abs: Partial<Absence>) => void;
  deleteAbsence: (id: string) => void;
  // Alerts
  resolveAlert: (id: string) => void;
  dismissAllAlerts: () => void;
  // Admin
  updateAdmin: (admin: Partial<AdminProfile>) => void;
  updateOrganization: (org: Partial<OrganizationInfo>) => void;
  updatePDFDefaults: (pdf: Partial<PDFDefaults>) => void;
  // UI
  toggleDarkMode: () => void;
  setCurrentPage: (page: string) => void;
  // Notifications
  addNotification: (msg: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  // Data
  resetAllData: () => void;
}

const defaultDepartments: Department[] = [
  { id: '1', name: 'Recursos Humanos', color: '#10b981' },
  { id: '2', name: 'Tecnologia', color: '#3b82f6' },
  { id: '3', name: 'Financeiro', color: '#8b5cf6' },
  { id: '4', name: 'Comercial', color: '#f59e0b' },
  { id: '5', name: 'Jurídico', color: '#ef4444' },
  { id: '6', name: 'Marketing', color: '#ec4899' },
  { id: '7', name: 'Operações', color: '#06b6d4' },
  { id: '8', name: 'Administração', color: '#6366f1' },
];

const defaultPositions: Position[] = [
  { id: '1', title: 'Diretor', departmentId: '8' },
  { id: '2', title: 'Gestor de RH', departmentId: '1' },
  { id: '3', title: 'Desenvolvedor Senior', departmentId: '2' },
  { id: '4', title: 'Analista Financeiro', departmentId: '3' },
  { id: '5', title: 'Comercial', departmentId: '4' },
  { id: '6', title: 'Advogado', departmentId: '5' },
  { id: '7', title: 'Designer', departmentId: '6' },
  { id: '8', title: 'Operador', departmentId: '7' },
];

const defaultAbsenceTypes: AbsenceType[] = [
  { id: '1', name: 'Férias', color: '#10b981', maxDays: 22 },
  { id: '2', name: 'Maternidade', color: '#ec4899', maxDays: 90 },
  { id: '3', name: 'Paternidade', color: '#3b82f6', maxDays: 5 },
  { id: '4', name: 'Licença Médica', color: '#6366f1' },
  { id: '5', name: 'Falecimento', color: '#6b7280', maxDays: 5 },
  { id: '6', name: 'Casamento', color: '#f59e0b', maxDays: 5 },
  { id: '7', name: 'Falta Justificada', color: '#14b8a6' },
  { id: '8', name: 'Falta Injustificada', color: '#ef4444' },
  { id: '9', name: 'Formação', color: '#8b5cf6' },
];

const defaultEmployees: Employee[] = [
  { id: '1', name: 'João Silva', departmentId: '2', positionId: '3', email: 'joao@empresa.ao', phone: '+244 923 000 001', hireDate: '2024-01-15', active: true },
  { id: '2', name: 'Maria Santos', departmentId: '1', positionId: '2', email: 'maria@empresa.ao', phone: '+244 924 000 002', hireDate: '2023-06-01', active: true },
  { id: '3', name: 'Pedro Costa', departmentId: '3', positionId: '4', email: 'pedro@empresa.ao', phone: '+244 925 000 003', hireDate: '2024-03-10', active: true },
  { id: '4', name: 'Ana Fernandes', departmentId: '4', positionId: '5', email: 'ana@empresa.ao', phone: '+244 926 000 004', hireDate: '2023-09-20', active: true },
  { id: '5', name: 'Carlos Mendes', departmentId: '5', positionId: '6', email: 'carlos@empresa.ao', phone: '+244 927 000 005', hireDate: '2024-07-01', active: true },
  { id: '6', name: 'Teresa Oliveira', departmentId: '6', positionId: '7', email: 'teresa@empresa.ao', phone: '+244 928 000 006', hireDate: '2023-11-15', active: true },
  { id: '7', name: 'Miguel Sousa', departmentId: '7', positionId: '8', email: 'miguel@empresa.ao', phone: '+244 929 000 007', hireDate: '2024-02-28', active: true },
  { id: '8', name: 'Luísa Neto', departmentId: '2', positionId: '3', email: 'luisa@empresa.ao', phone: '+244 923 000 008', hireDate: '2024-05-10', active: true },
];

const currentYear = new Date().getFullYear();
const defaultAbsences: Absence[] = [
  { id: '1', employeeId: '1', typeId: '1', startDate: `${currentYear}-07-01`, endDate: `${currentYear}-07-22`, status: 'approved', createdAt: `${currentYear}-05-01` },
  { id: '2', employeeId: '2', typeId: '1', startDate: `${currentYear}-08-05`, endDate: `${currentYear}-08-26`, status: 'approved', createdAt: `${currentYear}-06-01` },
  { id: '3', employeeId: '3', typeId: '4', startDate: `${currentYear}-10-10`, endDate: `${currentYear}-10-17`, status: 'approved', createdAt: `${currentYear}-10-09` },
  { id: '4', employeeId: '4', typeId: '1', startDate: `${currentYear}-12-15`, endDate: `${currentYear}-12-31`, status: 'pending', createdAt: `${currentYear}-09-15` },
  { id: '5', employeeId: '6', typeId: '2', startDate: `${currentYear}-03-01`, endDate: `${currentYear}-05-30`, status: 'approved', createdAt: `${currentYear}-02-15` },
  { id: '6', employeeId: '5', typeId: '1', startDate: `${currentYear}-09-01`, endDate: `${currentYear}-09-15`, status: 'approved', createdAt: `${currentYear}-07-01` },
];

const defaultAlerts: ComplianceAlert[] = [
  { id: '1', type: 'warning', title: 'Férias por gozar', description: 'Pedro Costa tem 22 dias de férias por gozar do período anterior.', employeeId: '3', date: new Date().toISOString().split('T')[0], resolved: false },
  { id: '2', type: 'info', title: 'Prazo de concessão', description: 'Ana Fernandes solicitou férias — prazo de resposta em 15 dias.', employeeId: '4', date: new Date().toISOString().split('T')[0], resolved: false },
  { id: '3', type: 'critical', title: 'Licença de maternidade próxima do fim', description: 'Teresa Oliveira — licença de maternidade termina em 30 dias. Planear regresso.', employeeId: '6', date: new Date().toISOString().split('T')[0], resolved: false },
];

const AppContext = createContext<AppContextType | null>(null);

function loadState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveState(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

let idCounter = Date.now();
function generateId(): string {
  return String(++idCounter);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(() => loadState('departments', defaultDepartments));
  const [positions, setPositions] = useState<Position[]>(() => loadState('positions', defaultPositions));
  const [employees, setEmployees] = useState<Employee[]>(() => loadState('employees', defaultEmployees));
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>(() => loadState('absenceTypes', defaultAbsenceTypes));
  const [absences, setAbsences] = useState<Absence[]>(() => loadState('absences', defaultAbsences));
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(() => loadState('alerts', defaultAlerts));
  const [admin, setAdmin] = useState<AdminProfile>(() => loadState('admin', { name: 'Administrador', role: 'Admin', institution: 'Empresa S.A.' }));
  const [organization, setOrganization] = useState<OrganizationInfo>(() => loadState('organization', { name: '', nif: '' }));
  const [pdfDefaults, setPdfDefaults] = useState<PDFDefaults>(() => loadState('pdfDefaults', { header: '', subtitle: '' }));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => loadState('darkMode', false));
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Persist state
  useEffect(() => { saveState('departments', departments); }, [departments]);
  useEffect(() => { saveState('positions', positions); }, [positions]);
  useEffect(() => { saveState('employees', employees); }, [employees]);
  useEffect(() => { saveState('absenceTypes', absenceTypes); }, [absenceTypes]);
  useEffect(() => { saveState('absences', absences); }, [absences]);
  useEffect(() => { saveState('alerts', alerts); }, [alerts]);
  useEffect(() => { saveState('admin', admin); }, [admin]);
  useEffect(() => { saveState('organization', organization); }, [organization]);
  useEffect(() => { saveState('pdfDefaults', pdfDefaults); }, [pdfDefaults]);
  useEffect(() => { saveState('darkMode', darkMode); }, [darkMode]);

  // Auto-remove notifications after 4s
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const addDepartment = (dept: Omit<Department, 'id'>) => setDepartments(prev => [...prev, { ...dept, id: generateId() }]);
  const updateDepartment = (id: string, data: Partial<Department>) => setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  const deleteDepartment = (id: string) => setDepartments(prev => prev.filter(d => d.id !== id));

  const addPosition = (pos: Omit<Position, 'id'>) => setPositions(prev => [...prev, { ...pos, id: generateId() }]);
  const updatePosition = (id: string, data: Partial<Position>) => setPositions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deletePosition = (id: string) => setPositions(prev => prev.filter(p => p.id !== id));

  const addEmployee = (emp: Omit<Employee, 'id'>) => setEmployees(prev => [...prev, { ...emp, id: generateId() }]);
  const updateEmployee = (id: string, data: Partial<Employee>) => setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  const deleteEmployee = (id: string) => setEmployees(prev => prev.filter(e => e.id !== id));

  const addAbsenceType = (type: Omit<AbsenceType, 'id'>) => setAbsenceTypes(prev => [...prev, { ...type, id: generateId() }]);
  const updateAbsenceType = (id: string, data: Partial<AbsenceType>) => setAbsenceTypes(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteAbsenceType = (id: string) => setAbsenceTypes(prev => prev.filter(t => t.id !== id));

  const addAbsence = (abs: Omit<Absence, 'id' | 'createdAt'>) => setAbsences(prev => [...prev, { ...abs, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }]);
  const updateAbsence = (id: string, data: Partial<Absence>) => setAbsences(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAbsence = (id: string) => setAbsences(prev => prev.filter(a => a.id !== id));

  const resolveAlert = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  const dismissAllAlerts = () => setAlerts(prev => prev.map(a => ({ ...a, resolved: true })));

  const updateAdmin = (data: Partial<AdminProfile>) => setAdmin(prev => ({ ...prev, ...data }));
  const updateOrganization = (data: Partial<OrganizationInfo>) => setOrganization(prev => ({ ...prev, ...data }));
  const updatePDFDefaults = (data: Partial<PDFDefaults>) => setPdfDefaults(prev => ({ ...prev, ...data }));
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addNotification = (message: string, type: Notification['type']) => {
    setNotifications(prev => [...prev, { id: generateId(), message, type, timestamp: Date.now() }]);
  };
  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Reset all data to defaults
  const resetAllData = () => {
    setDepartments(defaultDepartments);
    setPositions(defaultPositions);
    setEmployees(defaultEmployees);
    setAbsenceTypes(defaultAbsenceTypes);
    setAbsences(defaultAbsences);
    setAlerts(defaultAlerts);
    setAdmin({ name: 'Administrador', role: 'Admin', institution: 'Empresa S.A.' });
    setNotifications([]);
    setDarkMode(false);
    setCurrentPage('dashboard');
  };

  return (
    <AppContext.Provider value={{
      departments, positions, employees, absenceTypes, absences, alerts, admin, organization, pdfDefaults, notifications,
      darkMode, currentPage,
      addDepartment, updateDepartment, deleteDepartment,
      addPosition, updatePosition, deletePosition,
      addEmployee, updateEmployee, deleteEmployee,
      addAbsenceType, updateAbsenceType, deleteAbsenceType,
      addAbsence, updateAbsence, deleteAbsence,
      resolveAlert, dismissAllAlerts,
      updateAdmin, updateOrganization, updatePDFDefaults, toggleDarkMode, setCurrentPage,
      addNotification, removeNotification,
      resetAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
