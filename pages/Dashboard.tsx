import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Droplet,
  History,
  Truck,
  TrendingUp,
  MoreVertical,
  Download,
  Bell,
  Search,
  ShieldCheck,
  LogIn,
  Filter
} from 'lucide-react';
import { CONSUMPTION_TRENDS } from '../constants';
import { useFleet } from '../FleetContext';
import { useAuth } from '../AuthContext';

const Dashboard: React.FC = () => {
  const { secretariats, transactions, vehicles } = useFleet();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Filtros do Gestor
  const [filterSecretariat, setFilterSecretariat] = useState<string>('ALL');
  const [filterPlate, setFilterPlate] = useState<string>('ALL');
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alerts = secretariats.filter(s => s.status !== 'HEALTHY');

  const uniqueMonths = useMemo(() => [
    { value: '01', label: 'Janeiro', short: 'Jan' },
    { value: '02', label: 'Fevereiro', short: 'Fev' },
    { value: '03', label: 'Março', short: 'Mar' },
    { value: '04', label: 'Abril', short: 'Abr' },
    { value: '05', label: 'Maio', short: 'Mai' },
    { value: '06', label: 'Junho', short: 'Jun' },
    { value: '07', label: 'Julho', short: 'Jul' },
    { value: '08', label: 'Agosto', short: 'Ago' },
    { value: '09', label: 'Setembro', short: 'Set' },
    { value: '10', label: 'Outubro', short: 'Out' },
    { value: '11', label: 'Novembro', short: 'Nov' },
    { value: '12', label: 'Dezembro', short: 'Dez' },
  ], []);

  const uniqueYears = useMemo(() => {
    const years = new Set(transactions.map(t => {
      if (!t.date) return null;
      const match = t.date.match(/\b(20\d{2})\b/);
      return match ? match[1] : null;
    }).filter(Boolean) as string[]);
    return Array.from(years).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const vehicle = vehicles.find(v => v.plate === t.plate);
      if (filterSecretariat !== 'ALL' && vehicle?.secretariat !== filterSecretariat) return false;
      if (filterPlate !== 'ALL' && t.plate !== filterPlate) return false;
      
      if (filterYear !== 'ALL' && t.date) {
        const yearMatch = t.date.match(/\b(20\d{2})\b/);
        if (!yearMatch || yearMatch[1] !== filterYear) return false;
      }
      
      if (filterMonth !== 'ALL' && t.date) {
         const monthObj = uniqueMonths.find(m => m.value === filterMonth);
         const isTextMonth = monthObj && t.date.toLowerCase().includes(monthObj.short.toLowerCase());
         const isNumMonth = t.date.includes(`-${filterMonth}-`) || t.date.includes(`/${filterMonth}/`);
         if (!isTextMonth && !isNumMonth) return false;
      }
      
      return true;
    });
  }, [transactions, vehicles, filterSecretariat, filterPlate, filterYear, filterMonth, uniqueMonths]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (filterSecretariat !== 'ALL' && v.secretariat !== filterSecretariat) return false;
      if (filterPlate !== 'ALL' && v.plate !== filterPlate) return false;
      return true;
    });
  }, [vehicles, filterSecretariat, filterPlate]);

  const kpis = useMemo(() => {
    const activeSecretariats = filterSecretariat === 'ALL' 
      ? secretariats 
      : secretariats.filter(s => s.name === filterSecretariat);

    const totalContracted = activeSecretariats.reduce((acc, s) => acc + s.contracted, 0);
    
    // Se não há filtro de tempo/placa, mostramos o consumido direto da secretaria para ser mais rápido (e exato com inicial).
    // Mas para abranger os filtros de ano/mês/placa, calculamos via transactions
    const hasSpecificFilters = filterPlate !== 'ALL' || filterYear !== 'ALL' || filterMonth !== 'ALL';
    const totalConsumed = hasSpecificFilters 
      ? filteredTransactions.reduce((acc, t) => acc + t.volume, 0)
      : activeSecretariats.reduce((acc, s) => acc + s.consumed, 0);
      
    const totalRemaining = totalContracted - totalConsumed;
    const monthlyConsumption = filterMonth !== 'ALL' ? totalConsumed : transactions
      .filter(t => t.date && (t.date.includes('Out') || t.date.includes('-10-') || t.date.includes('/10/'))) // Default to Oct if no filter
      .reduce((acc, t) => acc + t.volume, 0);

    const fuelConsumption = {
      gasolina: filteredTransactions.filter(t => t.fuelType === 'GASOLINA').reduce((acc, t) => acc + t.volume, 0),
      dieselS500: filteredTransactions.filter(t => t.fuelType === 'DIESEL S500').reduce((acc, t) => acc + t.volume, 0),
      dieselS10: filteredTransactions.filter(t => t.fuelType === 'DIESEL S10').reduce((acc, t) => acc + t.volume, 0),
    };

    return {
      totalContracted,
      totalConsumed,
      totalRemaining,
      monthlyConsumption,
      percentAvailable: totalContracted > 0 ? (Math.max(0, totalRemaining) / totalContracted) * 100 : 0,
      fuelConsumption
    };
  }, [secretariats, transactions, filteredTransactions, filterSecretariat, filterPlate, filterYear, filterMonth]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user?.role === 'SECRETARIO' ? `Dashboard: ${secretariats[0]?.name || 'Secretaria'}` : 'Admin Global Dashboard'}
          </h1>
          <p className="text-sm text-slate-500">Visão geral da frota, consumo e alocações de combustível.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar dados..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 relative"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {alerts.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-900">Notificações</h3>
                  <p className="text-xs text-slate-500">Alertas do sistema</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map(s => (
                      <div key={s.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-semibold text-slate-900">{s.name}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                            s.status === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {s.status === 'CRITICAL' ? 'Crítico' : 'Aviso'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Apenas <span className="font-bold text-slate-700">{s.remaining.toLocaleString()} L</span> restantes da cota.
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <ShieldCheck className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Nenhuma nova notificação</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors">
            <Download className="w-4 h-4" />
            Relatórios
          </button>
        </div>
      </div>

      {user?.role !== 'SECRETARIO' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-2">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" /> Filtros do Gestor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Órgão (Secretaria)</label>
              <select
                value={filterSecretariat}
                onChange={(e) => {
                  setFilterSecretariat(e.target.value);
                  setFilterPlate('ALL');
                }}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
              >
                <option value="ALL">Todos os Órgãos</option>
                {secretariats.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Placa</label>
              <select
                value={filterPlate}
                onChange={(e) => setFilterPlate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
              >
                <option value="ALL">Todas as Placas</option>
                {vehicles
                  .filter(v => filterSecretariat === 'ALL' || v.secretariat === filterSecretariat)
                  .map(v => (
                    <option key={v.plate} value={v.plate}>{v.plate} - {v.model}</option>
                  ))
                }
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ano</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
              >
                <option value="ALL">Todos os Anos</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mês</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
              >
                <option value="ALL">Todos os Meses</option>
                {uniqueMonths.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Litros Restantes</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{kpis.totalRemaining.toLocaleString()}</p>
              <p className="text-sm text-primary font-semibold mt-1">{kpis.percentAvailable.toFixed(0)}% Disponível</p>
            </div>
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="150" strokeDashoffset={150 - (150 * (kpis.percentAvailable / 100))} className="text-primary transition-all duration-1000" />
              </svg>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Consumo por Tipo</p>
            <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
              <span>Gasolina</span>
              <span className="font-semibold text-slate-900">{kpis.fuelConsumption.gasolina.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
              <span>Diesel S500</span>
              <span className="font-semibold text-slate-900">{kpis.fuelConsumption.dieselS500.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Diesel S10</span>
              <span className="font-semibold text-slate-900">{kpis.fuelConsumption.dieselS10.toLocaleString()} L</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Contratado</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <History className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{kpis.totalContracted.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">L (Limite Anual)</p>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Veículos Ativos</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{filteredVehicles.filter(v => v.status === 'ACTIVE').length}</p>
          <p className="text-sm text-slate-500 mt-1">Monitoramento em tempo real</p>
          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-300"></div>
            ))}
            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[8px] text-white font-bold">+{filteredVehicles.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consumo Mensal</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{kpis.monthlyConsumption.toLocaleString()}</p>
          <p className="text-sm text-rose-600 font-semibold mt-1">↑ 8.2% vs mês anterior</p>
          <div className="mt-4 flex items-end gap-1 h-6">
            {[4, 6, 5, 8, 10].map((h, i) => (
              <div key={i} style={{ height: `${h * 10}%` }} className={`flex-1 rounded-sm ${i === 4 ? 'bg-rose-500' : 'bg-rose-100'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tendências de Consumo</h3>
              <p className="text-sm text-slate-500">Consumo diário total (L) nos últimos 30 dias</p>
            </div>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {CONSUMPTION_TRENDS.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONSUMPTION_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {CONSUMPTION_TRENDS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#135bec' : '#bfdbfe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <p className="text-slate-400 text-sm font-medium">Nenhuma tendência identificada ainda.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Alertas de Baixa Cota</h3>
              <p className="text-sm text-slate-500">Secretarias em nível crítico</p>
            </div>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto scrollbar-hide">
            {secretariats.filter(s => s.status !== 'HEALTHY').length > 0 ? (
              secretariats.filter(s => s.status !== 'HEALTHY').map(s => (
                <div key={s.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900">{s.name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${s.status === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>{s.status === 'CRITICAL' ? 'Crítico' : 'Aviso'}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Restante: <span className="font-bold text-slate-900">{s.remaining.toLocaleString()} L</span></p>
                      <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${(s.remaining / s.contracted) * 100}%` }}></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{((s.remaining / s.contracted) * 100).toFixed(1)}% Restante</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-slate-400 text-xs font-semibold">Tudo sob controle.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold">Desempenho por Secretaria (Centro de Custo)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Secretaria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Contratado (L)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Consumido (L)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Restante (L)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filterSecretariat === 'ALL' ? secretariats : secretariats.filter(s => s.name === filterSecretariat)).length > 0 ? (
                (filterSecretariat === 'ALL' ? secretariats : secretariats.filter(s => s.name === filterSecretariat)).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${s.status === 'CRITICAL' ? 'bg-rose-100 text-rose-600' :
                          s.status === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>{s.shortName}</div>
                        <span className="font-semibold text-sm text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">{s.contracted.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">{s.consumed.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${s.status === 'CRITICAL' ? 'text-rose-600' :
                      s.status === 'WARNING' ? 'text-amber-600' : 'text-slate-800'
                      }`}>{s.remaining.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${s.status === 'CRITICAL' ? 'bg-rose-100 text-rose-600' :
                        s.status === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>{s.status === 'CRITICAL' ? 'Crítico' : s.status === 'WARNING' ? 'Aviso' : 'Saudável'}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma secretaria cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
