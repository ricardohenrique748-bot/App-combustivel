
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SupplyEntry from './pages/SupplyEntry';
import Reports from './pages/Reports';
import Secretariats from './pages/Secretariats';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Page } from './types';
import { FleetProvider } from './FleetContext';
import { useAuth } from './AuthContext';

const App: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');

  React.useEffect(() => {
    if (user && user.role?.toUpperCase() === 'FISCAL' && currentPage !== 'SUPPLY_ENTRY') {
      setCurrentPage('SUPPLY_ENTRY');
    }
  }, [user, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'DASHBOARD':
        if (user?.role?.toUpperCase() === 'FISCAL') return null;
        return <Dashboard />;
      case 'SECRETARIATS':
        if (user?.role?.toUpperCase() === 'FISCAL') return null;
        return <Secretariats />;
      case 'VEHICLES':
        if (user?.role?.toUpperCase() === 'FISCAL') return null;
        return <Vehicles />;
      case 'SUPPLY_ENTRY':
        if (user?.role?.toUpperCase() === 'SECRETARIO') return null;
        return <SupplyEntry setCurrentPage={setCurrentPage} />;
      case 'REPORTS':
        if (user?.role?.toUpperCase() === 'FISCAL') return null;
        return <Reports />;
      case 'SETTINGS':
        if (user?.role?.toUpperCase() !== 'GESTOR') return null;
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl text-slate-300">⚙️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Página em Construção</h2>
            <p className="text-slate-500 max-w-xs mt-2">Estamos trabalhando para trazer as funcionalidades de {currentPage} para você em breve.</p>
            <button
              onClick={() => setCurrentPage('DASHBOARD')}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Voltar ao Início
            </button>
          </div>
        );
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <FleetProvider>
      <div className="flex min-h-screen bg-background-light selection:bg-primary/20">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={() => {
            logout();
            setCurrentPage('DASHBOARD');
          }}
        />

        <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>

          <footer className="mt-16 text-center py-8 border-t border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              © 2023 FleetFuel Management System • Government Utility Sector • v2.4.1
            </p>
          </footer>
        </main>
      </div>
    </FleetProvider>
  );
};

export default App;
