
import React from 'react';
import {
  LayoutDashboard,
  Building2,
  CarFront,
  Fuel,
  Users,
  ClipboardList,
  Settings,
  ChevronDown,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { Page } from '../types';
import { useAuth } from '../AuthContext';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
  const { user } = useAuth();
  const menuItems = [
    { id: 'DASHBOARD' as Page, label: 'Dashboard', icon: LayoutDashboard, section: 'MANAGEMENT', roles: ['GESTOR', 'SECRETARIO', 'FISCAL'] },
    { id: 'SECRETARIATS' as Page, label: 'Secretarias', icon: Building2, section: 'MANAGEMENT', roles: ['GESTOR', 'SECRETARIO', 'FISCAL'] },
    { id: 'VEHICLES' as Page, label: 'Veículos', icon: CarFront, section: 'MANAGEMENT', roles: ['GESTOR', 'SECRETARIO', 'FISCAL'] },
    { id: 'SUPPLY_ENTRY' as Page, label: 'Entrada de Combustível', icon: PlusCircle, section: 'MANAGEMENT', roles: ['GESTOR', 'FISCAL'] },
    { id: 'REPORTS' as Page, label: 'Relatórios', icon: ClipboardList, section: 'SYSTEM', roles: ['GESTOR', 'SECRETARIO', 'FISCAL'] },
    { id: 'SETTINGS' as Page, label: 'Configurações', icon: Settings, section: 'SYSTEM', roles: ['GESTOR', 'FISCAL'] },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50 overflow-hidden shadow-lg shadow-slate-200/50">
      <div className="p-6 flex items-center space-x-3 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
        <div className="bg-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary-100 ring-offset-2">
          <Fuel className="text-white w-6 h-6" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">Smart Tech</span>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Gestão de Frotas</span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto scrollbar-hide pb-20">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 mt-2">Gestão</p>

        {menuItems.filter(item => item.section === 'MANAGEMENT' && user && item.roles.includes(user.role?.toUpperCase() || '')).map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${currentPage === item.id
              ? 'bg-primary text-white shadow-md shadow-primary/30 font-medium'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
              }`}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200 ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span>{item.label}</span>
          </button>
        ))}

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-8 mb-3">Sistema</p>
        {menuItems.filter(item => item.section === 'SYSTEM' && user && item.roles.includes(user.role?.toUpperCase() || '')).map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${currentPage === item.id
              ? 'bg-primary text-white shadow-md shadow-primary/30 font-medium'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary font-medium'
              }`}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200 ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm mb-3">
          <div className="relative">
            <img
              className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-100"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`}
              alt="User"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role?.toUpperCase() === 'GESTOR' ? 'Gestor' : user?.role?.toUpperCase() === 'SECRETARIO' ? 'Secretário' : 'Fiscal - Nível Gestor'}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
