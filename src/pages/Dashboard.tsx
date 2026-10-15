import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Users, CalendarCheck, TrendingUp, X, Download, Share2, Copy } from 'lucide-react';
import { shareWhatsApp, copyToClipboard } from '../utils/whatsapp';
import { getDepartmentColor } from '../utils/colors';

export default function Dashboard() {
  const { employees, absences, absenceTypes, departments, alerts, darkMode, addNotification, admin, dismissAllAlerts } = useApp();
  const currentYear = new Date().getFullYear();

  const activeAlerts = alerts.filter(a => !a.resolved);

  const stats = useMemo(() => {
    const totalEmployees = employees.filter(e => e.active).length;
    const currentAbsences = absences.filter(a => {
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      const now = new Date();
      return start <= now && end >= now && a.status === 'approved';
    });
    const onLeave = currentAbsences.length;
    const pendingRequests = absences.filter(a => a.status === 'pending').length;
    const absenceRate = totalEmployees > 0 ? Math.round((onLeave / totalEmployees) * 100) : 0;
    return { totalEmployees, onLeave, pendingRequests, absenceRate };
  }, [employees, absences]);

  // Department distribution
  const deptData = useMemo(() => {
    return departments.map(dept => ({
      name: dept.name,
      value: employees.filter(e => e.departmentId === dept.id && e.active).length,
      color: dept.color,
    })).filter(d => d.value > 0);
  }, [departments, employees]);

  // Absence types distribution
  const absenceData = useMemo(() => {
    const yearAbsences = absences.filter(a => a.startDate.startsWith(String(currentYear)));
    return absenceTypes.map(type => ({
      name: type.name,
      value: yearAbsences.filter(a => a.typeId === type.id).length,
      color: type.color,
    })).filter(d => d.value > 0);
  }, [absences, absenceTypes, currentYear]);

  // Monthly absence trend
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((month, idx) => {
      const count = absences.filter(a => {
        const start = new Date(a.startDate);
        return start.getFullYear() === currentYear && start.getMonth() === idx && a.status === 'approved';
      }).length;
      return { name: month, ausências: count };
    });
  }, [absences, currentYear]);

  const handleExportChart = (chartName: string, data: unknown[]) => {
    const text = `${chartName}\n${JSON.stringify(data, null, 2)}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Gráfico exportado com sucesso', 'success');
  };

  const handleShareWhatsApp = (text: string) => {
    shareWhatsApp(text);
  };

  const handleCopyClipboard = async (text: string) => {
    await copyToClipboard(text);
    addNotification('Copiado para a área de transferência', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Critical Alerts Banner */}
      {activeAlerts.length > 0 && (
        <div className={`rounded-xl p-4 border animate-slideIn ${darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-300">
                  {activeAlerts.length} alerta(s) de conformidade
                </p>
                <p className="text-sm opacity-70">{activeAlerts[0].title}: {activeAlerts[0].description}</p>
              </div>
            </div>
            <button
              onClick={dismissAllAlerts}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              Dispensar
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Colaboradores" value={stats.totalEmployees} color="emerald" darkMode={darkMode} />
        <KPICard icon={CalendarCheck} label="Em Ausência" value={stats.onLeave} color="blue" darkMode={darkMode} />
        <KPICard icon={TrendingUp} label="Pedidos Pendentes" value={stats.pendingRequests} color="amber" darkMode={darkMode} />
        <KPICard icon={AlertTriangle} label="Taxa Absentismo" value={`${stats.absenceRate}%`} color="red" darkMode={darkMode} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Distribuição por Departamento</h3>
            <ChartActions
              onExport={() => handleExportChart('Departamentos', deptData)}
              onWhatsApp={() => handleShareWhatsApp(`Distribuição por Departamento:\n${deptData.map(d => `${d.name}: ${d.value}`).join('\n')}`)}
              onCopy={() => handleCopyClipboard(`Distribuição por Departamento:\n${deptData.map(d => `${d.name}: ${d.value}`).join('\n')}`)}
              darkMode={darkMode}
            />
          </div>
          <div id="chart-departments" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {deptData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Absence Types */}
        <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Tipos de Ausência ({currentYear})</h3>
            <ChartActions
              onExport={() => handleExportChart('Tipos_Ausencia', absenceData)}
              onWhatsApp={() => handleShareWhatsApp(`Tipos de Ausência ${currentYear}:\n${absenceData.map(d => `${d.name}: ${d.value}`).join('\n')}`)}
              onCopy={() => handleCopyClipboard(`Tipos de Ausência ${currentYear}:\n${absenceData.map(d => `${d.name}: ${d.value}`).join('\n')}`)}
              darkMode={darkMode}
            />
          </div>
          <div id="chart-absences" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={absenceData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {absenceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className={`rounded-xl p-5 border lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Tendência Mensal de Ausências ({currentYear})</h3>
            <ChartActions
              onExport={() => handleExportChart('Tendencia_Mensal', monthlyData)}
              onWhatsApp={() => handleShareWhatsApp(`Tendência Mensal ${currentYear}:\n${monthlyData.map(d => `${d.name}: ${d.ausências}`).join('\n')}`)}
              onCopy={() => handleCopyClipboard(`Tendência Mensal ${currentYear}:\n${monthlyData.map(d => `${d.name}: ${d.ausências}`).join('\n')}`)}
              darkMode={darkMode}
            />
          </div>
          <div id="chart-monthly" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ausências" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color, darkMode }: { icon: React.ElementType; label: string; value: string | number; color: string; darkMode: boolean }) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };
  const darkColorMap: Record<string, string> = {
    emerald: 'bg-emerald-900/30 text-emerald-300 border-emerald-700',
    blue: 'bg-blue-900/30 text-blue-300 border-blue-700',
    amber: 'bg-amber-900/30 text-amber-300 border-amber-700',
    red: 'bg-red-900/30 text-red-300 border-red-700',
  };

  return (
    <div className={`rounded-xl p-4 border ${darkMode ? darkColorMap[color] : colorMap[color]} animate-fadeInUp`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-white/70'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-70">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ChartActions({ onExport, onWhatsApp, onCopy, darkMode }: { onExport: () => void; onWhatsApp: () => void; onCopy: () => void; darkMode: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onExport} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Exportar">
        <Download className="w-4 h-4" />
      </button>
      <button onClick={onWhatsApp} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Partilhar WhatsApp">
        <Share2 className="w-4 h-4" />
      </button>
      <button onClick={onCopy} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Copiar">
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
}
