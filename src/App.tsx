import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VacationMap from './pages/VacationMap';
import Employees from './pages/Employees';
import Absences from './pages/Absences';
import Compliance from './pages/Compliance';
import Versioning from './pages/Versioning';
import Settings from './pages/Settings';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'vacation-map': return <VacationMap />;
      case 'employees': return <Employees />;
      case 'absences': return <Absences />;
      case 'compliance': return <Compliance />;
      case 'versioning': return <Versioning />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
