
import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Save,
  Globe,
  Smartphone,
  Check,
  Users,
  Mail,
  Trash2,
  Edit2,
  PlusCircle,
  X,
  UserCheck,
  ClipboardList,
  ShieldCheck,
  Building2,
  Lock,
  MapPin,
  Plus
} from 'lucide-react';
import { User as UserType, FuelStation } from '../types';
import { useAuth } from '../AuthContext';
import { useFleet } from '../FleetContext';

// ── Modal Convidar / Editar Usuário ──────────────────────────────────────────
interface UserModalProps {
  initialData?: Partial<UserType>;
  onSave: (data: { name: string; email: string; password?: string; role: 'GESTOR' | 'SECRETARIO' | 'FISCAL'; status: 'ACTIVE' | 'INACTIVE'; secretariatId?: string }) => void;
  onClose: () => void;
  title: string;
}

const roleOptions: { value: 'GESTOR' | 'SECRETARIO' | 'FISCAL'; label: string; description: string; icon: React.ElementType; color: string }[] = [
  {
    value: 'GESTOR',
    label: 'Gestor',
    description: 'Acesso total ao sistema, relatórios e configurações.',
    icon: ShieldCheck,
    color: 'primary',
  },
  {
    value: 'FISCAL',
    label: 'Fiscal',
    description: 'Pode registrar abastecimentos e visualizar relatórios.',
    icon: ClipboardList,
    color: 'emerald',
  },
  {
    value: 'SECRETARIO',
    label: 'Secretário',
    description: 'Visualiza cotas e consumo da secretaria vinculada.',
    icon: UserCheck,
    color: 'amber',
  },
];

const colorMap: Record<string, string> = {
  primary: 'border-primary bg-primary/5 text-primary',
  emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-500 bg-amber-50 text-amber-700',
};
const colorMapUnselected = 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50';

const UserModal: React.FC<UserModalProps> = ({ initialData, onSave, onClose, title }) => {
  const { secretariats } = useFleet();
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'GESTOR' | 'SECRETARIO' | 'FISCAL'>(initialData?.role || 'FISCAL');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(initialData?.status || 'ACTIVE');
  const [secretariatId, setSecretariatId] = useState(initialData?.secretariatId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nome é obrigatório.';
    if (!email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'E-mail inválido.';

    if (!initialData && !password.trim()) {
      e.password = 'A senha é obrigatória.';
    } else if (password && password.length < 6) {
      e.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if ((role === 'SECRETARIO' || role === 'FISCAL') && !secretariatId) {
      e.secretariatId = 'É necessário vincular o usuário a uma secretaria/órgão.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ 
      name: name.trim(), 
      email: email.trim(), 
      password: password || undefined,
      role, 
      status, 
      secretariatId: secretariatId || undefined 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-black text-slate-800">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/40 ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
            />
            {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@prefeitura.gov.br"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 ${errors.email ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso</label>
              {initialData && (
                <span className="text-[10px] text-slate-400 font-medium">(Opcional para edição)</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 ${errors.password ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsabilidade / Cargo</label>
            <div className="grid grid-cols-1 gap-2">
              {roleOptions.map(opt => {
                const isSelected = role === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${isSelected ? colorMap[opt.color] : colorMapUnselected}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight">{opt.label}</p>
                      <p className="text-[11px] opacity-70 leading-tight mt-0.5">{opt.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Órgão / Secretaria</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={secretariatId}
                onChange={e => setSecretariatId(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/40 appearance-none ${errors.secretariatId ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
              >
                <option value="">Nenhum / Sem vínculo específico</option>
                {secretariats.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>
            {errors.secretariatId && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.secretariatId}</p>}
          </div>

          {initialData && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
              <div className="flex gap-3">
                {(['ACTIVE', 'INACTIVE'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all ${status === s
                      ? s === 'ACTIVE'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-rose-400 bg-rose-50 text-rose-600'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {s === 'ACTIVE' ? '● Ativo' : '○ Inativo'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary/25 text-sm"
            >
              {initialData ? 'Salvar' : 'Convidar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const { secretariats, fuelPrices: contextFuelPrices, updateFuelPrices, fuelStations, addFuelStation, updateFuelStation, deleteFuelStation } = useFleet();
  const [activeTab, setActiveTab] = React.useState('general');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const [localFuelPrices, setLocalFuelPrices] = useState(contextFuelPrices);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para Gestão de Postos
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [editingStation, setEditingStation] = useState<FuelStation | null>(null);
  const [newStation, setNewStation] = useState<Partial<FuelStation>>({
    name: '',
    address: '',
    region: '',
    status: 'ACTIVE'
  });

  React.useEffect(() => {
    setLocalFuelPrices(contextFuelPrices);
  }, [contextFuelPrices]);

  const handleSavePrices = async () => {
    setIsSaving(true);
    await updateFuelPrices(localFuelPrices);
    setIsSaving(false);
    alert('Preços atualizados com sucesso!');
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: SettingsIcon },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'stations', label: 'Postos', icon: Building2 },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'data', label: 'Dados & API', icon: Database },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Configurações do Sistema</h1>
          <p className="text-sm text-slate-500">Ajuste preferências globais e parâmetros de controle.</p>
        </div>
        <button 
          onClick={activeTab === 'general' ? handleSavePrices : undefined}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="lg:col-span-1 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-6 text-left">
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Gestão de Usuários
                </h3>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Convidar Usuário
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Usuário</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Cargo</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{user.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.role === 'GESTOR'
                            ? 'bg-primary/10 text-primary' : user.role === 'SECRETARIO' ? 'bg-amber-100 text-amber-600'
                            : 'bg-slate-100 text-slate-500'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className="text-xs font-bold text-slate-600">
                              {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {user.id !== currentUser?.id && (
                              <button
                                onClick={() => {
                                  if (confirm('Tem certeza que deseja excluir?')) {
                                    deleteUser(user.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stations' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Postos Credenciados
                </h3>
                <button
                  onClick={() => setShowAddStationModal(true)}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Novo Posto
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Posto</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Cidade/Região</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fuelStations.map((station) => (
                      <tr key={station.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{station.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{station.address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-600 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {station.region}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                            station.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {station.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingStation(station)}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir?')) {
                                  deleteFuelStation(station.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Modais de Usuário ── */}
          {showInviteModal && (
            <UserModal
              title="Convidar Novo Usuário"
              onClose={() => setShowInviteModal(false)}
              onSave={(data) => {
                addUser({ ...data, lastAccess: 'Ainda não acessou' });
                setShowInviteModal(false);
              }}
            />
          )}
          {editingUser && (
            <UserModal
              title="Editar Usuário"
              initialData={editingUser}
              onClose={() => setEditingUser(null)}
              onSave={(data) => {
                updateUser(editingUser.id, data);
                setEditingUser(null);
              }}
            />
          )}

          {/* ── Modais de Posto ── */}
          {(showAddStationModal || editingStation) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-black text-slate-800">
                      {editingStation ? 'Editar Posto' : 'Novo Posto Credenciado'}
                    </h2>
                  </div>
                  <button
                    onClick={() => { setShowAddStationModal(false); setEditingStation(null); }}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nome do Posto</label>
                    <input
                      type="text"
                      value={editingStation?.name ?? newStation.name}
                      onChange={(e) => {
                        if (editingStation) setEditingStation({ ...editingStation, name: e.target.value });
                        else setNewStation({ ...newStation, name: e.target.value });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Endereço Completo</label>
                    <input
                      type="text"
                      value={editingStation?.address ?? newStation.address}
                      onChange={(e) => {
                        if (editingStation) setEditingStation({ ...editingStation, address: e.target.value });
                        else setNewStation({ ...newStation, address: e.target.value });
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cidade/Região</label>
                      <input
                        type="text"
                        value={editingStation?.region ?? newStation.region}
                        onChange={(e) => {
                          if (editingStation) setEditingStation({ ...editingStation, region: e.target.value });
                          else setNewStation({ ...newStation, region: e.target.value });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                      <select
                        value={editingStation?.status ?? newStation.status}
                        onChange={(e) => {
                          const val = e.target.value as 'ACTIVE' | 'INACTIVE';
                          if (editingStation) setEditingStation({ ...editingStation, status: val });
                          else setNewStation({ ...newStation, status: val });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        <option value="ACTIVE">Ativo</option>
                        <option value="INACTIVE">Inativo</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => { setShowAddStationModal(false); setEditingStation(null); }}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (editingStation) {
                          updateFuelStation(editingStation.id, editingStation);
                          setEditingStation(null);
                        } else {
                          addFuelStation(newStation as any);
                          setNewStation({ name: '', address: '', region: '', status: 'ACTIVE' });
                          setShowAddStationModal(false);
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg text-sm"
                    >
                      {editingStation ? 'Salvar' : 'Cadastrar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Parâmetros de Combustível
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Gasolina (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={localFuelPrices.GASOLINA}
                    onChange={e => setLocalFuelPrices(prev => ({ ...prev, GASOLINA: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Etanol (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={localFuelPrices.ETANOL}
                    onChange={e => setLocalFuelPrices(prev => ({ ...prev, ETANOL: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Diesel S10 (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={localFuelPrices.DIESEL_S10}
                    onChange={e => setLocalFuelPrices(prev => ({ ...prev, DIESEL_S10: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Diesel Comum (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={localFuelPrices.DIESEL_COMUM}
                    onChange={e => setLocalFuelPrices(prev => ({ ...prev, DIESEL_COMUM: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Alertas de Monitoramento
              </h3>

              <div className="space-y-4">
                {[
                  { title: 'Aviso de Baixa Cota (75%)', desc: 'Notificar gestores quando a secretaria atingir 75% da cota mensal.', active: true },
                  { title: 'Alerta de Baixa Eficiência', desc: 'Identificar veículos operando abaixo da média de 7.5 KM/L.', active: true },
                  { title: 'Lembrete de Manutenção', desc: 'Avisar quando o veículo estiver a 500km da próxima revisão.', active: false },
                  { title: 'Abastecimentos Suspeitos', desc: 'IA analisa padrões de consumo para detectar fraudes em tempo real.', active: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="max-w-md">
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button className={`w-12 h-6 rounded-full p-1 transition-colors relative ${item.active ? 'bg-primary' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Segurança e Acesso
              </h3>

              <div className="space-y-6">
                <div className="p-4 border border-slate-100 rounded-xl">
                  <p className="text-sm font-bold text-slate-800">Autenticação em Duas Etapas (2FA)</p>
                  <p className="text-xs text-slate-500 mb-4">Aumente a segurança da conta exigindo um código de verificação.</p>
                  <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Configurar 2FA</button>
                </div>

                <div className="p-4 border border-slate-100 rounded-xl">
                  <p className="text-sm font-bold text-slate-800">Alterar Senha</p>
                  <p className="text-xs text-slate-500 mb-4">Recomendamos trocar sua senha a cada 90 dias.</p>
                  <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Atualizar Senha</button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Gerenciamento de Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left hover:bg-slate-100 transition-colors">
                    <p className="text-sm font-bold text-slate-800">Exportar Banco de Dados</p>
                    <p className="text-xs text-slate-500">Download completo em formato .SQL ou .JSON</p>
                  </button>
                  <button className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left hover:bg-slate-100 transition-colors">
                    <p className="text-sm font-bold text-slate-800">Limpar Cache do Sistema</p>
                    <p className="text-xs text-slate-500">Forçar atualização de todos os dashboards</p>
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
