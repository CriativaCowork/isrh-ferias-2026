import React from 'react';
import { useApp } from '../context/AppContext';
import { VERSION_HISTORY } from '../utils/version';
import { GitBranch, Calendar, Code, Layout, Palette, FileText } from 'lucide-react';

export default function Versioning() {
  const { darkMode } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold">Versionamento do Sistema</h2>
        <p className="text-sm opacity-60">Histórico completo de alterações e evoluções</p>
      </div>

      <div className="space-y-6">
        {VERSION_HISTORY.map((version, idx) => (
          <div key={version.version} className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Version Header */}
            <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">v{version.version}</h3>
                    <p className="text-xs opacity-60 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {version.date}
                    </p>
                  </div>
                </div>
                {idx === 0 && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Atual</span>
                )}
              </div>
            </div>

            {/* Version Content - 4 Sections */}
            <div className="p-5 space-y-5">
              {/* 1. Versionamento */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-semibold text-sm">Versionamento</h4>
                </div>
                <ul className="space-y-1 ml-6">
                  {version.notes.map((note, i) => (
                    <li key={i} className="text-sm opacity-70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Funcionalidades Novas */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-sm">Funcionalidades Novas</h4>
                  <span className="text-xs opacity-50">({version.features.length})</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {version.features.map((feat, i) => (
                    <li key={i} className="text-sm opacity-70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Páginas Novas */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4 text-purple-500" />
                  <h4 className="font-semibold text-sm">Páginas</h4>
                  <span className="text-xs opacity-50">({version.pages.length})</span>
                </div>
                <div className="flex flex-wrap gap-2 ml-6">
                  {version.pages.map((page, i) => (
                    <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
                      {page}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. CSS de cada página */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-pink-500" />
                  <h4 className="font-semibold text-sm">Estilos CSS</h4>
                </div>
                <ul className="space-y-1 ml-6">
                  {version.css.map((style, i) => (
                    <li key={i} className="text-sm opacity-70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      {style}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
