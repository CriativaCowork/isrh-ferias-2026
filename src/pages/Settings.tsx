import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Plus, Edit2, Trash2, Palette } from 'lucide-react';
import Modal from '../components/Modal';

export default function Settings() {
  const { admin, updateAdmin, departments, positions, addDepartment, updateDepartment, deleteDepartment, addPosition, updatePosition, deletePosition, darkMode, addNotification } = useApp();

  const [adminForm, setAdminForm] = useState({ name: admin.name, role: admin.role, institution: admin.institution });
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const [deptForm, setDeptForm] = useState({ name: '', color: '#10b981' });
  const [posForm, setPosForm] = useState({ title: '', departmentId: departments[0]?.id || '' });

  const handleSaveAdmin = () => {
    updateAdmin(adminForm);
    addNotification('Perfil atualizado', 'success');
  };

  // Department CRUD
  const openAddDept = () => {
    setEditingDept(null);
    setDeptForm({ name: '', color: '#10b981' });
    setShowDeptModal(true);
  };

  const openEditDept = (id: string) => {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    setEditingDept(id);
    setDeptForm({ name: dept.name, color: dept.color });
    setShowDeptModal(true);
  };

  const handleSaveDept = () => {
    if (!deptForm.name) { addNotification('Nome obrigatório', 'error'); return; }
    if (editingDept) {
      updateDepartment(editingDept, deptForm);
      addNotification('Departamento atualizado', 'success');
    } else {
      addDepartment(deptForm);
      addNotification('Departamento adicionado', 'success');
    }
    setShowDeptModal(false);
  };

  // Position CRUD
  const openAddPos = () => {
    setEditingPos(null);
    setPosForm({ title: '', departmentId: departments[0]?.id || '' });
    setShowPosModal(true);
  };

  const openEditPos = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;
    setEditingPos(id);
    setPosForm({ title: pos.title, departmentId: pos.departmentId });
    setShowPosModal(true);
  };

  const handleSavePos = () => {
    if (!posForm.title) { addNotification('Título obrigatório', 'error'); return; }
    if (editingPos) {
      updatePosition(editingPos, posForm);
      addNotification('Cargo atualizado', 'success');
    } else {
      addPosition(posForm);
      addNotification('Cargo adicionado', 'success');
    }
    setShowPosModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-lg font-bold">Configurações</h2>

      {/* Admin Profile */}
      <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4">Perfil do Administrador</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Nome</label>
            <input type="text" value={adminForm.name} onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Cargo</label>
            <input type="text" value={adminForm.role} onChange={e => setAdminForm(f => ({ ...f, role: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Instituição</label>
            <input type="text" value={adminForm.institution} onChange={e => setAdminForm(f => ({ ...f, institution: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
        </div>
        <button onClick={handleSaveAdmin} className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>

      {/* Departments */}
      <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Departamentos</h3>
          <button onClick={openAddDept} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map(dept => (
            <div key={dept.id} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: dept.color }} />
                <span className="text-sm font-medium">{dept.name}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEditDept(dept.id)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => { deleteDepartment(dept.id); addNotification('Departamento removido', 'info'); }} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Positions */}
      <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Cargos</h3>
          <button onClick={openAddPos} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {positions.map(pos => {
            const dept = departments.find(d => d.id === pos.departmentId);
            return (
              <div key={pos.id} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div>
                  <span className="text-sm font-medium">{pos.title}</span>
                  <p className="text-xs opacity-50">{dept?.name}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditPos(pos.id)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { deletePosition(pos.id); addNotification('Cargo removido', 'info'); }} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Modal */}
      <Modal isOpen={showDeptModal} onClose={() => setShowDeptModal(false)} title={editingDept ? 'Editar Departamento' : 'Novo Departamento'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Nome</label>
            <input type="text" value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Cor</label>
            <div className="flex items-center gap-3">
              <input type="color" value={deptForm.color} onChange={e => setDeptForm(f => ({ ...f, color: e.target.value }))} className="h-10 w-20 rounded-lg border cursor-pointer" />
              <span className="text-sm opacity-60">{deptForm.color}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowDeptModal(false)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Cancelar</button>
            <button onClick={handleSaveDept} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">Guardar</button>
          </div>
        </div>
      </Modal>

      {/* Position Modal */}
      <Modal isOpen={showPosModal} onClose={() => setShowPosModal(false)} title={editingPos ? 'Editar Cargo' : 'Novo Cargo'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Título</label>
            <input type="text" value={posForm.title} onChange={e => setPosForm(f => ({ ...f, title: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Departamento</label>
            <select value={posForm.departmentId} onChange={e => setPosForm(f => ({ ...f, departmentId: e.target.value }))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowPosModal(false)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Cancelar</button>
            <button onClick={handleSavePos} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
