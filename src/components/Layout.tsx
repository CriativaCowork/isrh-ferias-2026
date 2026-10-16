import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Map, Users, CalendarX, Shield, GitBranch, Settings, Moon, Sun, Menu, X, ChevronLeft, ChevronRight, LogOut, User, Bell } from 'lucide-react';
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

type SidebarMode = 'expanded' | 'collapsed' | 'closed';

export default function Layout({ children }: LayoutProps) {
  const { darkMode, toggleDarkMode, currentPage, setCurrentPage, admin, notifications, removeNotification } = useApp();
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('expanded');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setSidebarMode(prev => {
      if (prev === 'expanded') return 'collapsed';
      if (prev === 'collapsed') return 'expanded';
      return 'expanded';
    });
  };

  const closeSidebar = () => setSidebarMode('closed');
  const openSidebar = () => setSidebarMode('collapsed');

  const isExpanded = sidebarMode === 'expanded';
  const isCollapsed = sidebarMode === 'collapsed';
  const isClosed = sidebarMode === 'closed';

  const sidebarWidth = isExpanded ? 'w-64' : isCollapsed ? 'w-16' : 'w-0';
  const mainMargin = isClosed ? 'ml-0' : isExpanded ? 'lg:ml-64' : 'lg:ml-16';

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} transform transition-all duration-300 ease-in-out ${
          isClosed ? '-translate-x-full lg:translate-x-0 lg:w-0' : 'translate-x-0'
        } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-lg overflow-hidden`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Logo */}
          <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Map className="w-5 h-5 text-white" />
              </div>
              {isExpanded && (
                <div className="animate-fadeIn">
                  <h1 className="font-bold text-sm">ISRH</h1>
                  <p className="text-xs opacity-60">Mapa de Férias</p>
                </div>
              )}
            </div>
            {isExpanded && (
              <button
                onClick={toggleSidebar}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Recolher menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  className={`group w-full flex items-center ${isExpanded ? 'gap-3 px-3 py-2.5' : 'justify-center px-0 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`} />
                  {isExpanded && <span className="animate-fadeIn">{item.label}</span>}
                  
                  {/* Tooltip when collapsed */}
                  {!isExpanded && (
                    <div className={`absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {item.label}
                    </div>
                  )}

                  {/* Hover indicator */}
                  {!isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-4 bg-emerald-500 rounded-r transition-all duration-200" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collapse toggle button (when collapsed) */}
          {isCollapsed && (
            <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={toggleSidebar}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Expandir menu"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile when expanded */}
      {isExpanded && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${mainMargin}`}>
        {/* Top Bar */}
        <header className={`sticky top-0 z-20 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} border-b backdrop-blur-md`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Sidebar toggle */}
              {isClosed ? (
                <button
                  onClick={openSidebar}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Abrir menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={closeSidebar}
                  className={`p-2 rounded-lg lg:hidden ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <h2 className="font-semibold text-lg capitalize">
                {navItems.find(n => n.id === currentPage)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications bell */}
              <button
                className={`relative p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* Dark mode toggle */}
              <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Admin Profile - Top Right */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium leading-tight">{admin.name}</p>
                    <p className="text-xs opacity-60 leading-tight">{admin.role}</p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border overflow-hidden animate-scaleIn ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{admin.name}</p>
                          <p className="text-xs opacity-60 truncate">{admin.role}</p>
                          <p className="text-xs opacity-50 truncate">{admin.institution}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { setCurrentPage('settings'); setProfileOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Settings className="w-4 h-4" />
                        Configurações
                      </button>
                      <button
                        onClick={() => { setCurrentPage('versioning'); setProfileOpen(false); }}
                        className={`w-full flex items-center justify-between items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          Versão
                        </div>
                        <span className="text-xs opacity-50">v{getCurrentVersion()}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
