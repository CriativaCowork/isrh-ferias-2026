import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, X } from 'lucide-react';
import Modal from './Modal';

interface PdfHeaderConfigProps {
  localHeader: string;
  localSubtitle: string;
  onHeaderChange: (header: string) => void;
  onSubtitleChange: (subtitle: string) => void;
}

export default function PdfHeaderConfig({ localHeader, localSubtitle, onHeaderChange, onSubtitleChange }: PdfHeaderConfigProps) {
  const { darkMode, pdfDefaults, addNotification } = useApp();
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState(localHeader);
  const [subtitle, setSubtitle] = useState(localSubtitle);

  const handleSave = () => {
    onHeaderChange(header);
    onSubtitleChange(subtitle);
    setOpen(false);
    addNotification('Cabeçalho do PDF atualizado', 'success');
  };

  const handleReset = () => {
    setHeader('');
    setSubtitle('');
    onHeaderChange('');
    onSubtitleChange('');
    setOpen(false);
    addNotification('Cabeçalho do PDF reposto para o padrão', 'info');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
          darkMode ? 'border-gray-700 hover:bg-gray-700 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
        }`}
        title="Personalizar cabeçalho do PDF"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Cabeçalho PDF</span>
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Personalizar Cabeçalho do PDF" size="md">
        <div className="space-y-4">
          <div className={`p-3 rounded-lg text-xs ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            <p>Estes valores serão usados como cabeçalho do PDF gerado nesta página. Se deixados em branco, serão usados os valores padrão definidos nas Configurações.</p>
            {pdfDefaults.header && (
              <p className="mt-2 opacity-70">Padrão atual: <strong>{pdfDefaults.header}</strong>{pdfDefaults.subtitle && ` — ${pdfDefaults.subtitle}`}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Cabeçalho</label>
            <input
              type="text"
              value={header}
              onChange={e => setHeader(e.target.value)}
              placeholder={pdfDefaults.header || 'Mapa de Férias'}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Subtítulo</label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder={pdfDefaults.subtitle || `Ano ${new Date().getFullYear()}`}
              className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
            />
          </div>
          <div className="flex justify-between pt-2">
            <button
              onClick={handleReset}
              className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              Repor padrão
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
