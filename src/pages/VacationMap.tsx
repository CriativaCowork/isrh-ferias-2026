import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Printer, Download, Share2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportVacationMapPDF } from '../utils/pdf';
import { shareWhatsApp, copyToClipboard } from '../utils/whatsapp';
import { getDepartmentColor } from '../utils/colors';

export default function VacationMap() {
  const { employees, departments, absences, absenceTypes, darkMode, admin, addNotification } = useApp();
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filteredEmployees = useMemo(() => {
    const emps = selectedDept === 'all' ? employees : employees.filter(e => e.departmentId === selectedDept);
    return emps.filter(e => e.active);
  }, [employees, selectedDept]);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const name = new Date(year, i).toLocaleDateString('pt-PT', { month: 'short' });
      const daysInMonth = new Date(year, i + 1, 0).getDate();
      return { index: i, name: name.charAt(0).toUpperCase() + name.slice(1), days: daysInMonth };
    });
  }, [year]);

  const totalDays = months.reduce((acc, m) => acc + m.days, 0);

  function getAbsenceForDay(empId: string, date: Date) {
    return absences.find(a => {
      if (a.employeeId !== empId || a.status !== 'approved') return false;
      const start = new Date(a.startDate);
      const end = new Date(a.endDate);
      return date >= start && date <= end;
    });
  }

  function getAbsenceTypeColor(typeId: string) {
    return absenceTypes.find(t => t.id === typeId)?.color || '#94a3b8';
  }

  function getEmployeeDeptColor(empId: string) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return '#6b7280';
    const dept = departments.find(d => d.id === emp.departmentId);
    return dept?.color || '#6b7280';
  }

  const handlePrintPDF = () => {
    const data = filteredEmployees.map(emp => ({
      name: emp.name,
      department: departments.find(d => d.id === emp.departmentId)?.name || '',
      vacations: absences.filter(a => a.employeeId === emp.id && a.startDate.startsWith(String(year))).map(a => ({
        start: a.startDate,
        end: a.endDate,
        type: absenceTypes.find(t => t.id === a.typeId)?.name || '',
      })),
    }));
    exportVacationMapPDF(data, year, admin.name);
    addNotification('PDF do Mapa de Férias exportado', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = `Mapa de Férias ${year}\n${filteredEmployees.map(emp => {
      const empAbsences = absences.filter(a => a.employeeId === emp.id && a.startDate.startsWith(String(year)) && a.status === 'approved');
      return `${emp.name}: ${empAbsences.length > 0 ? empAbsences.map(a => `${absenceTypes.find(t => t.id === a.typeId)?.name} (${a.startDate} a ${a.endDate})`).join(', ') : 'Sem ausências'}`;
    }).join('\n')}`;
    shareWhatsApp(text);
  };

  const handleCopyClipboard = async () => {
    const text = `Mapa de Férias ${year}\n${filteredEmployees.map(emp => {
      const empAbsences = absences.filter(a => a.employeeId === emp.id && a.startDate.startsWith(String(year)) && a.status === 'approved');
      return `${emp.name}: ${empAbsences.length > 0 ? empAbsences.map(a => `${absenceTypes.find(t => t.id === a.typeId)?.name} (${a.startDate} a ${a.endDate})`).join(', ') : 'Sem ausências'}`;
    }).join('\n')}`;
    await copyToClipboard(text);
    addNotification('Copiado para a área de transferência', 'success');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setYear(y => y - 1)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">{year}</h2>
          <button onClick={() => setYear(y => y + 1)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className={`text-sm px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
          >
            <option value="all">Todos os Departamentos</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <button onClick={handlePrintPDF} className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors">
            <Printer className="w-4 h-4" /> Imprimir PDF
          </button>
          <button onClick={handleShareWhatsApp} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="WhatsApp">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={handleCopyClipboard} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Copiar">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className={`rounded-xl p-3 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <p className="text-xs font-medium mb-2 opacity-70">Legenda de Ausências:</p>
        <div className="flex flex-wrap gap-3">
          {absenceTypes.map(type => (
            <div key={type.id} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: type.color }} />
              <span className="text-xs">{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Month Headers */}
            <div className="flex border-b" style={{ minHeight: '32px' }}>
              <div className={`sticky left-0 z-10 w-48 min-w-[12rem] px-3 py-2 text-xs font-semibold border-r ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                Colaborador
              </div>
              {months.map(month => (
                <div
                  key={month.index}
                  className={`flex-1 text-center py-2 text-xs font-semibold border-r ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                  style={{ minWidth: `${(100 / 12)}%` }}
                >
                  {month.name}
                </div>
              ))}
            </div>

            {/* Employee Rows */}
            {filteredEmployees.map(emp => {
              const deptColor = getEmployeeDeptColor(emp.id);
              return (
                <div key={emp.id} className={`flex border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'}`}>
                  {/* Employee Name - Fixed Column */}
                  <div className={`sticky left-0 z-10 w-48 min-w-[12rem] px-3 py-2 border-r flex items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: deptColor }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{emp.name}</p>
                      <p className="text-[10px] opacity-50 truncate">{departments.find(d => d.id === emp.departmentId)?.name}</p>
                    </div>
                  </div>

                  {/* Days Grid */}
                  {months.map(month => {
                    const daysInMonth = month.days;
                    const dayWidth = 100 / daysInMonth;
                    return (
                      <div
                        key={month.index}
                        className="flex-1 flex relative"
                        style={{ minWidth: `${100 / 12}%` }}
                      >
                        {Array.from({ length: daysInMonth }, (_, dayIdx) => {
                          const date = new Date(year, month.index, dayIdx + 1);
                          const absence = getAbsenceForDay(emp.id, date);
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          return (
                            <div
                              key={dayIdx}
                              className={`h-8 border-r ${darkMode ? 'border-gray-700/50' : 'border-gray-50'} ${isWeekend ? (darkMode ? 'bg-gray-800' : 'bg-gray-50') : ''}`}
                              style={{ width: `${dayWidth}%`, backgroundColor: absence ? getAbsenceTypeColor(absence.typeId) + '40' : undefined }}
                              title={absence ? `${absenceTypes.find(t => t.id === absence.typeId)?.name}: ${absence.startDate} a ${absence.endDate}` : `${date.toLocaleDateString('pt-PT')}`}
                            >
                              {absence && dayIdx === 0 && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAbsenceTypeColor(absence.typeId) }} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {filteredEmployees.length === 0 && (
              <div className="p-8 text-center opacity-50">
                <p>Nenhum colaborador encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
