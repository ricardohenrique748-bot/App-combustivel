
import React from 'react';
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
  MoreVertical,
  Trash2,
  Edit2,
  PlusCircle
} from 'lucide-react';
import { User as UserType } from '../types';
import { useAuth } from '../AuthContext';

const Settings: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = React.useState('general');


  const tabs = [
    { id: 'general', label: 'Geral', icon: SettingsIcon },
    { id: 'users', label: 'Usuários', icon: Users },
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
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 shadow-lg active:scale-95 transition-all">
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
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

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Gestão de Usuários
                </h3>
                <button
                  onClick={() => {
                    const email = prompt('E-mail do novo usuário:');
                    if (email) {
                      const name = prompt('Nome do novo usuário:');
                      const roleInput = prompt('Cargo (GESTOR, SECRETARIO ou FISCAL):', 'FISCAL');
                      if (name && (roleInput === 'GESTOR' || roleInput === 'SECRETARIO' || roleInput === 'FISCAL')) {
                        let secretariatId;
                        if (roleInput === 'SECRETARIO') {
                          secretariatId = prompt('ID da Secretaria (Ex: sec-obras, sec-saude):');
                        }
                        addUser({
                          id: Date.now().toString(),
                          name,
                          email,
                          role: roleInput as 'GESTOR' | 'SECRETARIO' | 'FISCAL',
                          status: 'ACTIVE',
                          lastAccess: 'Ainda não acessou',
                          ...(secretariatId ? { secretariatId } : {})
                        });
                      } else {
                        alert('Dados inválidos. Cargo deve ser GESTOR, SECRETARIO ou FISCAL.');
                      }
                    }
                  }}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Convidar Usuário
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Usuário</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Cargo</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                      <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Último Acesso</th>
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
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500 font-medium">{user.lastAccess}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const newName = prompt('Novo nome:', user.name);
                                const newEmail = prompt('Novo email:', user.email);
                                if (newName && newEmail) {
                                  updateUser(user.id, { name: newName, email: newEmail });
                                }
                              }}
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
                    defaultValue="5.899"
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Etanol (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    defaultValue="3.999"
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Diesel S10 (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    defaultValue="6.120"
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço Base: Diesel Comum (R$)</label>
                  <input
                    type="number"
                    step="0.001"
                    defaultValue="5.990"
                    className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Frequência de Relatório</label>
                  <select className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold appearance-none">
                    <option>Semanal (Segunda-feira)</option>
                    <option>Quinzenal</option>
                    <option>Mensal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Fuso Horário</label>
                  <select className="w-full p-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold appearance-none">
                    <option>Brasília (GMT-3)</option>
                    <option>Manaus (GMT-4)</option>
                  </select>
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

                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-sm font-bold text-rose-800">Sessões Ativas</p>
                  <p className="text-xs text-rose-600/70 mb-4">Existem 3 dispositivos conectados à sua conta no momento.</p>
                  <button className="text-xs font-black text-rose-600 uppercase tracking-widest hover:underline">Encerrar Todas as Sessões</button>
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

              <section className="bg-emerald-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest text-[10px]">App de Motorista</p>
                    <p className="text-xl font-black">Sincronização Ativa</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold">142 dispositivos conectados</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  Gerenciar Chaves
                </button>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
