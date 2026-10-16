import React, { useState, useMemo } from 'react';
import { useApp, Absence } from '../context/AppContext';
import { Plus, Edit2, Trash2, Check, X as XIcon, FileText, Share2, Copy, Calendar } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { exportTablePDF } from '../utils/pdf';
import { shareWhatsApp, copyToClipboard } from '../utils/whatsapp';

export default function Absences() {
  const { absences, absenceTypes, employees, departments, addAbsence, updateAbsence, deleteAbsence, addAbsenceType, updateAbsenceType, deleteAbsenceType, darkMode, addNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
  const [form, setForm] = useState({ employeeId: '', typeId: '', startDate: '', endDate: '', notes: '' });
  const [typeForm, setTypeForm] = useState({ name: '', color: '#10b981', maxDays: '' });
  const [editingType, setEditingType] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; label: string }>({ open: false, id: '', label: '' });

  const filtered = useMemo(() => {
    return absences.filter(a => {
      const matchType = filterType === 'all' || a.typeId === filterType;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchType && matchStatus;
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [absences, filterType, filterStatus]);

  const openAddModal = () => {
    setEditingAbsence(null);
    setForm({ employeeId: employees[0]?.id || '', typeId: absenceTypes[0]?.id || '', startDate: new Date().toISOString().split('T')[0], endDate: '', notes: '' });
    setShowModal(true);
  };

  const openEditModal = (abs: Absence) => {
    setEditingAbsence(abs);
    setForm({ employeeId: abs.employeeId, typeId: abs.typeId, startDate: abs.startDate, endDate: abs.endDate, notes: abs.notes || '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.employeeId || !form.typeId || !form.startDate || !form.endDate) {
      addNotification('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    if (editingAbsence) {
      updateAbsence(editingAbsence.id, { ...form });
      addNotification('Ausência atualizada', 'success');
    } else {
      addAbsence({ ...form, status: 'pending' });
      addNotification('Ausência registada', 'success');
    }
    setShowModal(false);
  };

  const handleApprove = (id: string) => {
    updateAbsence(id, { status: 'approved' });
    addNotification('Ausência aprovada', 'success');
  };

  const handleReject = (id: string) => {
    updateAbsence(id, { status: 'rejected' });
    addNotification('Ausência rejeitada', 'info');
  };

  const handleDelete = (id: string, label: string) => {
    setDeleteConfirm({ open: true, id, label });
  };

  const confirmDelete = () => {
    deleteAbsence(deleteConfirm.id);
    addNotification('Ausência removida', 'info');
  };

  const handleExportPDF = () => {
    const headers = ['Colaborador', 'Tipo', 'Início', 'Fim', 'Estado', 'Notas'];
    const rows = filtered.map(a => [
      employees.find(e => e.id === a.employeeId)?.name || '',
      absenceTypes.find(t => t.id === a.typeId)?.name || '',
      a.startDate,
      a.endDate,
      a.status === 'approved' ? 'Aprovado' : a.status === 'rejected' ? 'Rejeitado' : 'Pendente',
      a.notes || '',
    ]);
    exportTablePDF('Relatório de Ausências', headers, rows);
    addNotification('PDF exportado', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = `Relatório de Ausências:\n${filtered.map(a => `${employees.find(e => e.id === a.employeeId)?.name} - ${absenceTypes.find(t => t.id === a.typeId)?.name} (${a.startDate} a ${a.endDate}) - ${a.status}`).join('\n')}`;
    shareWhatsApp(text);
  };

  const handleCopyClipboard = async () => {
    const text = `Relatório de Ausências:\n${filtered.map(a => `${employees.find(e => e.id === a.employeeId)?.name} - ${absenceTypes.find(t => t.id === a.typeId)?.name} (${a.startDate} a ${a.endDate}) - ${a.status}`).join('\n')}`;
    await copyToClipboard(text);
    addNotification('Copiado', 'success');
  };

  // Absence Type CRUD
  const openAddType = () => {
    setEditingType(null);
    setTypeForm({ name: '', color: '#10b981', maxDays: '' });
    setShowTypeModal(true);
  };

  const openEditType = (id: string) => {
    const type = absenceTypes.find(t => t.id === id);
    if (!type) return;
    setEditingType(id);
    setTypeForm({ name: type.name, color: type.color, maxDays: type.maxDays?.toString() || '' });
    setShowTypeModal(true);
  };

  const handleSaveType = () => {
    if (!typeForm.name) {
      addNotification('Nome é obrigatório', 'error');
      return;
    }
    if (editingType) {
      updateAbsenceType(editingType, { name: typeForm.name, color: typeForm.color, maxDays: typeForm.maxDays ? parseInt(typeForm.maxDays) : undefined });
      addNotification('Tipo atualizado', 'success');
    } else {
      addAbsenceType({ name: typeForm.name, color: typeForm.color, maxDays: typeForm.maxDays ? parseInt(typeForm.maxDays) : undefined });
      addNotification('Tipo adicionado', 'success');
    }
    setShowTypeModal(false);
  };

  const statusColors: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const statusLabels: Record<string, string> = {
    approved: 'Aprovado',
    pending: 'Pendente',
    rejected: 'Rejeitado',
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`text-sm px-3 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <option value="all">Todos os Tipos</option>
            {absenceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`text-sm px-3 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <option value="all">Todos os Estados</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openAddType} className={`px-3 py-2 rounded-lg text-sm border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
            Gerir Tipos
          </button>
          <button onClick={openAddModal} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
            <Plus className="w-4 h-4" /> Registar
          </button>
          <button onClick={handleExportPDF} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><FileText className="w-4 h-4" /></button>
          <button onClick={handleShareWhatsApp} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Share2 className="w-4 h-4" /></button>
          <button onClick={handleCopyClipboard} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Copy className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Absence List */}
      <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <th className="text-left px-4 py-3 font-medium">Colaborador</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Período</th>
                <th className="text-left px-4 py-3 font-medium">Dias</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-right px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(abs => {
                const emp = employees.find(e => e.id === abs.employeeId);
                const type = absenceTypes.find(t => t.id === abs.typeId);
                const dept = departments.find(d => d.id === emp?.departmentId);
                const days = Math.ceil((new Date(abs.endDate).getTime() - new Date(abs.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                return (
                  <tr key={abs.id} className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: dept?.color || '#6b7280' }}>
                          {emp?.name.charAt(0)}
                        </div>
                        <span>{emp?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: type?.color }} />
                        {type?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 opacity-70">{abs.startDate} → {abs.endDate}</td>
                    <td className="px-4 py-3 opacity-70">{days}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[abs.status]}`}>
                        {statusLabels[abs.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {abs.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(abs.id)} className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleReject(abs.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><XIcon className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                        <button onClick={() => openEditModal(abs)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(abs.id, `${employees.find(e => e.id === abs.employeeId)?.name} - ${absenceTypes.find(t => t.id === abs.typeId)?.name}`)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center opacity-50">Nenhuma ausência registada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Absence Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingAbsence ? 'Editar Ausência' : 'Nova Ausência'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Colaborador *</label>
            <select value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              {employees.filter(e => e.active).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Tipo *</label>
            <select value={form.typeId} onChange={e => setForm(f => ({ ...f, typeId: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              {absenceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Data Início *</label>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Data Fim *</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Notas</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">Guardar</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: '', label: '' })}
        onConfirm={confirmDelete}
        title="Eliminar Ausência"
        message={`Tem a certeza que deseja eliminar o registo "${deleteConfirm.label}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* Absence Type Modal */}
      <Modal isOpen={showTypeModal} onClose={() => setShowTypeModal(false)} title="Gerir Tipos de Ausência" size="lg">
        <div className="space-y-4">
          <div className="space-y-2">
            {absenceTypes.map(type => (
              <div key={type.id} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: type.color }} />
                  <span className="text-sm font-medium">{type.name}</span>
                  {type.maxDays && <span className="text-xs opacity-50">(máx. {type.maxDays} dias)</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditType(type.id)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { deleteAbsenceType(type.id); addNotification('Tipo removido', 'info'); }} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className="text-sm font-medium mb-3">{editingType ? 'Editar Tipo' : 'Novo Tipo'}</p>
            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="Nome" value={typeForm.name} onChange={e => setTypeForm(f => ({ ...f, name: e.target.value }))} className={`px-3 py-2 rounded-lg border text-sm col-span-1 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
              <input type="color" value={typeForm.color} onChange={e => setTypeForm(f => ({ ...f, color: e.target.value }))} className="h-9 rounded-lg border cursor-pointer" />
              <input type="number" placeholder="Máx. dias" value={typeForm.maxDays} onChange={e => setTypeForm(f => ({ ...f, maxDays: e.target.value }))} className={`px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={handleSaveType} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">Guardar Tipo</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
