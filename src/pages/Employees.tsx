import React, { useState, useMemo } from 'react';
import { useApp, Employee } from '../context/AppContext';
import { Plus, Edit2, Trash2, Upload, Download, Grid, List, X, Search, FileText, Share2, Copy } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { generateTemplate, parseExcelFile, EmployeeImportData } from '../utils/excel';
import { exportTablePDF } from '../utils/pdf';
import { shareWhatsApp, copyToClipboard } from '../utils/whatsapp';
import { getDepartmentColor } from '../utils/colors';

export default function Employees() {
  const { employees, departments, positions, addEmployee, updateEmployee, deleteEmployee, darkMode, addNotification } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [importData, setImportData] = useState<EmployeeImportData[]>([]);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' });

  // Form state
  const [form, setForm] = useState({ name: '', departmentId: '', positionId: '', email: '', phone: '', hireDate: '', contractEnd: '' });

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === 'all' || e.departmentId === filterDept;
      return matchSearch && matchDept;
    });
  }, [employees, search, filterDept]);

  const openAddModal = () => {
    setEditingEmployee(null);
    setForm({ name: '', departmentId: departments[0]?.id || '', positionId: positions[0]?.id || '', email: '', phone: '', hireDate: new Date().toISOString().split('T')[0], contractEnd: '' });
    setShowModal(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({ name: emp.name, departmentId: emp.departmentId, positionId: emp.positionId, email: emp.email, phone: emp.phone, hireDate: emp.hireDate, contractEnd: emp.contractEnd || '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.departmentId) {
      addNotification('Preencha os campos obrigatórios', 'error');
      return;
    }
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, { ...form, contractEnd: form.contractEnd || undefined });
      addNotification('Colaborador atualizado', 'success');
    } else {
      addEmployee({ ...form, active: true, contractEnd: form.contractEnd || undefined });
      addNotification('Colaborador adicionado', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ open: true, id, name });
  };

  const confirmDelete = () => {
    deleteEmployee(deleteConfirm.id);
    addNotification('Colaborador removido', 'info');
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await parseExcelFile(file);
      setImportData(data);
      setShowImportModal(true);
      addNotification(`${data.length} colaboradores detectados`, 'info');
    } catch {
      addNotification('Erro ao ler ficheiro Excel', 'error');
    }
  };

  const handleImportConfirm = () => {
    importData.forEach(item => {
      const dept = departments.find(d => d.name.toLowerCase() === item.departamento.toLowerCase());
      const pos = positions.find(p => p.title.toLowerCase() === item.cargo.toLowerCase());
      if (importMode === 'replace') {
        const existing = employees.find(e => e.email === item.email);
        if (existing) deleteEmployee(existing.id);
      }
      addEmployee({
        name: item.nome,
        departmentId: dept?.id || departments[0]?.id || '',
        positionId: pos?.id || positions[0]?.id || '',
        email: item.email,
        phone: item.telefone,
        hireDate: item.dataAdmissao,
        contractEnd: item.fimContrato || undefined,
        active: true,
      });
    });
    addNotification(`${importData.length} colaboradores importados`, 'success');
    setShowImportModal(false);
    setImportData([]);
  };

  const handleExportPDF = () => {
    const headers = ['Nome', 'Departamento', 'Cargo', 'Email', 'Telefone', 'Data Admissão'];
    const rows = filtered.map(emp => [
      emp.name,
      departments.find(d => d.id === emp.departmentId)?.name || '',
      positions.find(p => p.id === emp.positionId)?.title || '',
      emp.email,
      emp.phone,
      emp.hireDate,
    ]);
    exportTablePDF('Colaboradores', headers, rows);
    addNotification('PDF exportado', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = `Lista de Colaboradores:\n${filtered.map(e => `${e.name} - ${departments.find(d => d.id === e.departmentId)?.name}`).join('\n')}`;
    shareWhatsApp(text);
  };

  const handleCopyClipboard = async () => {
    const text = `Lista de Colaboradores:\n${filtered.map(e => `${e.name} - ${departments.find(d => d.id === e.departmentId)?.name}`).join('\n')}`;
    await copyToClipboard(text);
    addNotification('Copiado para a área de transferência', 'success');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-40"
            />
          </div>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className={`text-sm px-3 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <option value="all">Todos</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={openAddModal} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors">
            <Plus className="w-4 h-4" /> Cadastrar
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" /> Importar
            <input type="file" accept=".xlsx,.xls" onChange={handleFileImport} className="hidden" />
          </label>
          <button onClick={generateTemplate} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Descarregar modelo">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={handleExportPDF} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Exportar PDF">
            <FileText className="w-4 h-4" />
          </button>
          <button onClick={handleShareWhatsApp} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="WhatsApp">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={handleCopyClipboard} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} title="Copiar">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(emp => {
            const dept = departments.find(d => d.id === emp.departmentId);
            const pos = positions.find(p => p.id === emp.positionId);
            return (
              <div key={emp.id} className={`rounded-xl p-4 border transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: dept?.color || '#6b7280' }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{emp.name}</p>
                      <p className="text-xs opacity-60">{pos?.title}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(emp)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(emp.id, emp.name)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-xs opacity-60">{emp.email}</p>
                  <p className="text-xs opacity-60">{emp.phone}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: (dept?.color || '#6b7280') + '20', color: dept?.color }}>
                      {dept?.name}
                    </span>
                    {emp.contractEnd && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700">
                        Termo: {emp.contractEnd}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <th className="text-left px-4 py-3 font-medium">Nome</th>
                  <th className="text-left px-4 py-3 font-medium">Departamento</th>
                  <th className="text-left px-4 py-3 font-medium">Cargo</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Admissão</th>
                  <th className="text-right px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const dept = departments.find(d => d.id === emp.departmentId);
                  const pos = positions.find(p => p.id === emp.positionId);
                  return (
                    <tr key={emp.id} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: dept?.color || '#6b7280' }}>
                            {emp.name.charAt(0)}
                          </div>
                          <span className="font-medium">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: (dept?.color || '#6b7280') + '20', color: dept?.color }}>
                          {dept?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 opacity-70">{pos?.title}</td>
                      <td className="px-4 py-3 opacity-70">{emp.email}</td>
                      <td className="px-4 py-3 opacity-70">{emp.hireDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEditModal(emp)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(emp.id, emp.name)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingEmployee ? 'Editar Colaborador' : 'Novo Colaborador'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Nome *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Departamento *</label>
              <select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Cargo</label>
              <select value={form.positionId} onChange={e => setForm(f => ({ ...f, positionId: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                {positions.filter(p => p.departmentId === form.departmentId || !form.departmentId).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Telefone</label>
              <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Data Admissão</label>
              <input type="date" value={form.hireDate} onChange={e => setForm(f => ({ ...f, hireDate: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fim de Contrato</label>
              <input type="date" value={form.contractEnd} onChange={e => setForm(f => ({ ...f, contractEnd: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">Guardar</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: '', name: '' })}
        onConfirm={confirmDelete}
        title="Eliminar Colaborador"
        message={`Tem a certeza que deseja eliminar o colaborador "${deleteConfirm.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="Importar Colaboradores" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={importMode === 'merge'} onChange={() => setImportMode('merge')} />
              <span className="text-sm">Juntar (adicionar novos)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} />
              <span className="text-sm">Substituir (sobrescrever existentes)</span>
            </label>
          </div>
          <div className={`rounded-lg border p-3 max-h-60 overflow-y-auto ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <table className="w-full text-xs">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <th className="px-2 py-1 text-left">Nome</th>
                  <th className="px-2 py-1 text-left">Departamento</th>
                  <th className="px-2 py-1 text-left">Cargo</th>
                  <th className="px-2 py-1 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {importData.map((item, idx) => (
                  <tr key={idx} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="px-2 py-1">{item.nome}</td>
                    <td className="px-2 py-1">{item.departamento}</td>
                    <td className="px-2 py-1">{item.cargo}</td>
                    <td className="px-2 py-1">{item.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowImportModal(false)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Cancelar</button>
            <button onClick={handleImportConfirm} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">Importar {importData.length} colaboradores</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
