import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, AlertCircle, Info, Download, Share2, Copy, CheckCircle, Calculator } from 'lucide-react';
import { exportTablePDF } from '../utils/pdf';
import { shareWhatsApp, copyToClipboard } from '../utils/whatsapp';
import PdfHeaderConfig from '../components/PdfHeaderConfig';

export default function Compliance() {
  const { alerts, employees, absences, absenceTypes, departments, resolveAlert, darkMode, addNotification, admin, organization, pdfDefaults } = useApp();
  const [localHeader, setLocalHeader] = useState('');
  const [localSubtitle, setLocalSubtitle] = useState('');

  const unresolvedAlerts = alerts.filter(a => !a.resolved);

  // Calculate legal compliance metrics
  const complianceMetrics = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const activeEmployees = employees.filter(e => e.active);
    
    // Employees with vacations this year
    const withVacations = activeEmployees.filter(emp => {
      return absences.some(a => a.employeeId === emp.id && a.typeId === absenceTypes.find(t => t.name === 'Férias')?.id && a.startDate.startsWith(String(currentYear)) && a.status === 'approved');
    });
    
    // Employees without vacations
    const withoutVacations = activeEmployees.filter(emp => !withVacations.includes(emp));
    
    // Total vacation days used
    const vacationType = absenceTypes.find(t => t.name === 'Férias');
    const totalDaysUsed = absences
      .filter(a => a.typeId === vacationType?.id && a.startDate.startsWith(String(currentYear)) && a.status === 'approved')
      .reduce((acc, a) => acc + Math.ceil((new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1, 0);
    
    // Estimated penalty (double payment for unused vacation)
    const penaltyEstimate = withoutVacations.length * 22; // days that could incur penalty
    
    return {
      totalEmployees: activeEmployees.length,
      withVacations: withVacations.length,
      withoutVacations: withoutVacations.length,
      totalDaysUsed,
      penaltyDays: penaltyEstimate,
      complianceRate: activeEmployees.length > 0 ? Math.round((withVacations.length / activeEmployees.length) * 100) : 0,
    };
  }, [employees, absences, absenceTypes]);

  const handleExportPDF = () => {
    const headers = ['Tipo', 'Título', 'Descrição', 'Data', 'Estado'];
    const rows = alerts.map(a => [
      a.type === 'critical' ? 'Crítico' : a.type === 'warning' ? 'Aviso' : 'Info',
      a.title,
      a.description,
      a.date,
      a.resolved ? 'Resolvido' : 'Ativo',
    ]);
    
    const header = localHeader || pdfDefaults.header || 'Relatório de Conformidade Legal';
    const subtitle = localSubtitle || pdfDefaults.subtitle || 'Lei 12/23 — Angola';
    
    exportTablePDF(header, headers, rows, {
      subtitle: subtitle,
      adminName: admin.name,
      orgName: organization.name,
      orgNif: organization.nif,
    });
    addNotification('PDF de conformidade exportado', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = `Relatório de Conformidade Legal (Lei 12/23):\n\n` +
      `Taxa de conformidade: ${complianceMetrics.complianceRate}%\n` +
      `Colaboradores com férias: ${complianceMetrics.withVacations}/${complianceMetrics.totalEmployees}\n` +
      `Dias de férias usados: ${complianceMetrics.totalDaysUsed}\n` +
      `Dias em risco de penalização: ${complianceMetrics.penaltyDays}\n\n` +
      `Alertas ativos:\n${unresolvedAlerts.map(a => `• ${a.title}: ${a.description}`).join('\n')}`;
    shareWhatsApp(text);
  };

  const handleCopyClipboard = async () => {
    const text = `Relatório de Conformidade Legal (Lei 12/23):\n\n` +
      `Taxa de conformidade: ${complianceMetrics.complianceRate}%\n` +
      `Colaboradores com férias: ${complianceMetrics.withVacations}/${complianceMetrics.totalEmployees}\n` +
      `Dias de férias usados: ${complianceMetrics.totalDaysUsed}\n` +
      `Dias em risco de penalização: ${complianceMetrics.penaltyDays}\n\n` +
      `Alertas ativos:\n${unresolvedAlerts.map(a => `• ${a.title}: ${a.description}`).join('\n')}`;
    await copyToClipboard(text);
    addNotification('Copiado para a área de transferência', 'success');
  };

  const alertIcons: Record<string, React.ElementType> = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const alertColors: Record<string, { bg: string; border: string; text: string; darkBg: string; darkBorder: string }> = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', darkBg: 'bg-red-900/20', darkBorder: 'border-red-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', darkBg: 'bg-amber-900/20', darkBorder: 'border-amber-700' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', darkBg: 'bg-blue-900/20', darkBorder: 'border-blue-700' },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Conformidade Legal — Lei 12/23</h2>
          <p className="text-sm opacity-60">Lei Geral do Trabalho de Angola</p>
        </div>
        <div className="flex items-center gap-2">
          <PdfHeaderConfig
            localHeader={localHeader}
            localSubtitle={localSubtitle}
            onHeaderChange={setLocalHeader}
            onSubtitleChange={setLocalSubtitle}
          />
          <button onClick={handleExportPDF} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Download className="w-4 h-4" /></button>
          <button onClick={handleShareWhatsApp} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Share2 className="w-4 h-4" /></button>
          <button onClick={handleCopyClipboard} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Copy className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Taxa de Conformidade" value={`${complianceMetrics.complianceRate}%`} color="emerald" darkMode={darkMode} />
        <MetricCard label="Com Férias Gozadas" value={`${complianceMetrics.withVacations}/${complianceMetrics.totalEmployees}`} color="blue" darkMode={darkMode} />
        <MetricCard label="Dias Usados" value={complianceMetrics.totalDaysUsed.toString()} color="purple" darkMode={darkMode} />
        <MetricCard label="Dias em Risco" value={complianceMetrics.penaltyDays.toString()} color="red" darkMode={darkMode} />
      </div>

      {/* Legal Rules Reference */}
      <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-3">Regras Legais (Lei 12/23)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <RuleItem label="Férias anuais" value="22 dias úteis" />
          <RuleItem label="Período aquisitivo" value="6 meses de trabalho" />
          <RuleItem label="Prazo de concessão" value="Até 12 meses após aquisitivo" />
          <RuleItem label="Divisão mínima" value="15 dias contínuos" />
          <RuleItem label="Licença maternidade" value="3 meses + 4 semanas" />
          <RuleItem label="Subsídio de férias" value="1/3 do salário" />
          <RuleItem label="Penalização" value="Pagamento em dobro" />
          <RuleItem label="Assistência médica" value="1 dia/mês (grávidas)" />
          <RuleItem label="Moeda base" value="Kwanza (AOA)" />
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <h3 className="font-semibold">Alertas de Conformidade</h3>
        {unresolvedAlerts.length === 0 ? (
          <div className={`rounded-xl p-8 text-center border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-medium">Tudo em conformidade!</p>
            <p className="text-sm opacity-60">Sem alertas pendentes</p>
          </div>
        ) : (
          unresolvedAlerts.map(alert => {
            const Icon = alertIcons[alert.type];
            const colors = alertColors[alert.type];
            const emp = employees.find(e => e.id === alert.employeeId);
            return (
              <div key={alert.id} className={`rounded-xl p-4 border ${darkMode ? `${colors.darkBg} ${colors.darkBorder}` : `${colors.bg} ${colors.border}`}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${colors.text}`} />
                    <div>
                      <p className={`font-semibold ${colors.text}`}>{alert.title}</p>
                      <p className="text-sm opacity-70 mt-1">{alert.description}</p>
                      {emp && <p className="text-xs opacity-50 mt-1">Colaborador: {emp.name}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => { resolveAlert(alert.id); addNotification('Alerta resolvido', 'success'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    Resolver
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Simulation */}
      <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5" />
          <h3 className="font-semibold">Simulação de Indemnização</h3>
        </div>
        <p className="text-sm opacity-70 mb-3">
          Se {complianceMetrics.withoutVacations} colaborador(es) não gozar(em) férias no período legal,
          a empresa poderá estar sujeita ao pagamento em dobro de <strong>{complianceMetrics.penaltyDays} dias</strong> de salário.
        </p>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className="text-xs opacity-60">Cálculo: {complianceMetrics.withoutVacations} colaboradores × 22 dias × 2 (dobro) = {complianceMetrics.penaltyDays * 2} dias de indemnização potencial</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, darkMode }: { label: string; value: string; color: string; darkMode: boolean }) {
  const colorMap: Record<string, string> = {
    emerald: darkMode ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue: darkMode ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700',
    purple: darkMode ? 'bg-purple-900/30 border-purple-700 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700',
    red: darkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700',
  };
  return (
    <div className={`rounded-xl p-4 border ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-70 mt-1">{label}</p>
    </div>
  );
}

function RuleItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <span className="opacity-70 text-xs">{label}</span>
      <span className="font-medium text-xs">{value}</span>
    </div>
  );
}
