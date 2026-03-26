import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  Droplet,
  History,
  Truck,
  TrendingUp,
  Bell,
  Search,
  ShieldCheck,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  User as UserIcon,
  Fuel,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [filterYear, setFilterYear] = useState<string>('2024'); // Default to 2024
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const vehicle = vehicles.find(v => v.plate === t.plate);
      if (filterSecretariat !== 'ALL' && vehicle?.secretariat_id !== filterSecretariat) return false;
      if (filterPlate !== 'ALL' && t.plate !== filterPlate) return false;
      
      if (filterYear !== 'ALL' && t.date) {
        if (!t.date.includes(filterYear)) return false;
      }
      
      if (filterMonth !== 'ALL' && t.date) {
         const monthObj = uniqueMonths.find(m => m.value === filterMonth);
         const isTextMonth = monthObj && t.date.toLowerCase().includes(monthObj.short.toLowerCase());
         const isNumMonth = t.date.includes(`-${filterMonth}-`) || t.date.includes(`/${filterMonth}/`);
         if (!isTextMonth && !isNumMonth) return false;
      }
      
      return true;
    }).sort((a, b) => {
        // Simple sort by date/time (reverse)
        return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
    });
  }, [transactions, vehicles, filterSecretariat, filterPlate, filterYear, filterMonth, uniqueMonths]);

  const fuelStatusAlerts = useMemo(() => {
    return secretariats
      .filter(s => s.status !== 'HEALTHY')
      .map(s => ({
        id: s.id,
        type: s.status === 'CRITICAL' ? 'error' : 'warning',
        title: `Cota Crítica: ${s.name}`,
        message: `Restam apenas ${s.remaining.toLocaleString()}L de ${s.contracted.toLocaleString()}L.`,
        date: 'Agora'
      }));
  }, [secretariats]);

  const allAlerts = fuelStatusAlerts;

  const logicConsumptionTrends = useMemo(() => {
    const counts: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      counts[dateStr] = 0;
    }

    filteredTransactions.forEach(t => {
      // Extract DD/MM for last 15 days
      const match = t.date.match(/(\d{2})[\/-](\d{2})/);
      if (match) {
        const dayMonth = `${match[1]}/${match[2]}`;
        if (counts[dayMonth] !== undefined) {
          counts[dayMonth] += t.volume;
        }
      }
    });

    return Object.entries(counts).map(([date, amount]) => ({ date, amount }));
  }, [filteredTransactions]);

  const kpis = useMemo(() => {
    const activeSecretariats = filterSecretariat === 'ALL' 
      ? secretariats 
      : secretariats.filter(s => s.id === filterSecretariat);

    const totalContracted = activeSecretariats.reduce((acc, s) => acc + s.contracted, 0);
    const totalConsumed = activeSecretariats.reduce((acc, s) => acc + s.consumed, 0);
    const totalRemaining = totalContracted - totalConsumed;
    
    const monthlyTotal = filteredTransactions.reduce((acc, t) => acc + t.volume, 0);

    const fuelTypeData = [
      { name: 'Gasolina', value: filteredTransactions.filter(t => t.fuelType === 'GASOLINA').reduce((acc, t) => acc + t.volume, 0) },
      { name: 'Diesel S10', value: filteredTransactions.filter(t => t.fuelType === 'DIESEL S10').reduce((acc, t) => acc + t.volume, 0) },
      { name: 'Etanol', value: filteredTransactions.filter(t => t.fuelType === 'ETANOL').reduce((acc, t) => acc + t.volume, 0) },
    ].filter(d => d.value > 0);

    return {
      totalContracted,
      totalConsumed,
      totalRemaining,
      monthlyTotal,
      percentAvailable: totalContracted > 0 ? (totalRemaining / totalContracted) * 100 : 0,
      fuelTypeData
    };
  }, [secretariats, filteredTransactions, filterSecretariat]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Glassmorphism */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl shadow-slate-200/50">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard <span className="text-primary">Frota</span>
          </h1>
          <p className="text-slate-500 font-medium tracking-wide">
            {user?.role === 'SECRETARIO' ? `Gestão da ${secretariats[0]?.name}` : 'Painel de Controle de Logística Governamental'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all relative group"
            >
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
              {allAlerts.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Notificações</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black uppercase">{allAlerts.length} Novos</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2 space-y-2">
                    {allAlerts.length > 0 ? (
                      allAlerts.map(alert => (
                        <div key={alert.id} className="p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${alert.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{alert.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{alert.message}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block font-medium">{alert.date}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-medium">Tudo em dia!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20">
            <Download className="w-4 h-4" />
            Extrair Dados
          </button>
        </div>
      </div>

      {/* Alertas Rápidos (Cards Coloridos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Droplet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-tighter">Budget</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Saldo de Cota</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-4xl font-black text-slate-900">{kpis.totalRemaining.toLocaleString()}</h2>
            <span className="text-sm font-bold text-slate-400 mb-1.5">L</span>
          </div>
          <div className="mt-6">
             <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-600">{kpis.percentAvailable.toFixed(1)}% Disponível</span>
                <span className="text-slate-400 font-medium">{kpis.totalConsumed.toLocaleString()} L usados</span>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${kpis.percentAvailable}%` }}
                    className="h-full bg-primary"
                />
             </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Frota Ativa</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-4xl font-black text-slate-900">{vehicles.filter(v => v.status === 'ACTIVE').length}</h2>
            <span className="text-sm font-bold text-slate-400 mb-1.5">VEÍCULOS</span>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-4 flex items-center gap-1">
             Total cadastrado no sistema
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-12 -mt-12"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-rose-600">+12%</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Gasto Mensal</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-4xl font-black text-slate-900">{kpis.monthlyTotal.toLocaleString()}</h2>
            <span className="text-sm font-bold text-slate-400 mb-1.5">L</span>
          </div>
          <div className="flex gap-1 mt-6 h-8 items-end">
             {[30, 45, 35, 60, 50, 70, 40].map((h, i) => (
               <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-sm ${i === 5 ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-rose-100'}`}></div>
             ))}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Eficiência</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-4xl font-black text-slate-900">10.4</h2>
            <span className="text-sm font-bold text-slate-400 mb-1.5">KM/L</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">Média Geral de Consumo</p>
        </motion.div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white/60 backdrop-blur-sm p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por placa, motorista ou secretaria..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <select 
              value={filterSecretariat}
              onChange={(e) => setFilterSecretariat(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[120px]"
            >
              <option value="ALL">Secretarias</option>
              {secretariats.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select 
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[100px]"
            >
              <option value="ALL">Mês: Todos</option>
              {uniqueMonths.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>

            <button className="p-3 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gráfico de Consumo Diário */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Uso diário de Combustível</h3>
              <p className="text-sm text-slate-400 font-medium">Fluxo de volumetria nos últimos 15 dias</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 cursor-pointer">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Litros</span>
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logicConsumptionTrends}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#135bec" />
                    <stop offset="100%" stopColor="#135bec" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 4 }} 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#fff',
                    padding: '12px'
                  }} 
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tanques de Combustível por Secretaria */}
        <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl origin-center"></div>
          
          <div className="relative z-10 flex justify-between items-center mb-8">
            <h3 className="text-lg font-black tracking-tight uppercase">Tanques por Pasta</h3>
            <Fuel className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-6 relative z-10">
            {secretariats.slice(0, 5).map(s => {
              const perc = (s.remaining / s.contracted) * 100;
              return (
                <div key={s.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>{s.shortName}</span>
                    <span className={perc < 20 ? 'text-rose-400' : 'text-emerald-400'}>{perc.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${perc}%` }}
                      className={`h-full rounded-full ${perc < 20 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(19,91,236,0.5)]'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
             Ver Todos os Tanques <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Abastecimentos Recentes */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Abastecimentos Recentes</h3>
                 <p className="text-sm text-slate-400 font-medium">Últimas ativações em postos credenciados</p>
              </div>
              <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Histórico Completo</button>
           </div>

           <div className="space-y-4">
              {filteredTransactions.slice(0, 6).map((t, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={t.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group shadow-sm bg-white"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs tracking-tighter group-hover:bg-primary transition-colors">
                         {t.plate.substring(0, 3)}<br/>{t.plate.substring(4)}
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-900">{t.fuelStation || 'POSTO CONVENIADO'}</p>
                         <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {t.driver.split(' ')[0]}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.date}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8 mt-4 sm:mt-0">
                      <div className="text-right">
                         <p className="text-sm font-black text-slate-900">{t.volume} L</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.fuelType}</p>
                      </div>
                      <div className="text-right min-w-[80px]">
                         <p className="text-sm font-black text-primary">R$ {t.value.toFixed(2)}</p>
                         <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-black uppercase tracking-tighter">EFICAZ</span>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Tipo de Combustível Dominante (Pie Chart) */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Mix Energético</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Distribuição por volume</p>
            
            <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={kpis.fuelTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {kpis.fuelTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#135bec', '#10b981', '#f59e0b', '#ef4444'][index % 4]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
                {kpis.fuelTypeData.map((d, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#135bec', '#10b981', '#f59e0b', '#ef4444'][i % 4] }}></div>
                            <span className="text-xs font-bold text-slate-500">{d.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">{d.value.toLocaleString()} L</span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
