import React, { ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Map, Users, CalendarX, Shield, GitBranch, Settings, Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { getCurrentVersion } from '../utils/version';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'vacation-map', label: 'Mapa de Férias', icon: Map },
  { id: 'employees', label: 'Colaboradores', icon: Users },
  { id: 'absences', label: 'Ausências', icon: CalendarX },
  { id: 'compliance', label: 'Conformidade', icon: Shield },
  { id: 'versioning', label: 'Versionamento', icon: GitBranch },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const { darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, currentPage, setCurrentPage, language, setLanguage, admin, notifications, removeNotification } = useApp();

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm">ISRH</h1>
                <p className="text-xs opacity-60">Mapa de Férias</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-700">{admin.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{admin.name}</p>
                <p className="text-xs opacity-50">v{getCurrentVersion()}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className={`sticky top-0 z-20 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} border-b backdrop-blur-md`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h2 className="font-semibold text-lg capitalize">
                {navItems.find(n => n.id === currentPage)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Language */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'pt-AO' | 'pt-PT' | 'en')}
                className={`text-xs px-2 py-1.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
              >
                <option value="pt-AO">PT-AO</option>
                <option value="pt-PT">PT-PT</option>
                <option value="en">EN</option>
              </select>
              {/* Dark mode toggle */}
              <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 animate-fadeIn">
          {children}
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border animate-slideIn flex items-center gap-3 ${
              n.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' :
              n.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' :
              n.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-800' :
              'bg-blue-50/90 border-blue-200 text-blue-800'
            }`}
          >
            <span className="text-sm flex-1">{n.message}</span>
            <button onClick={() => removeNotification(n.id)} className="opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
