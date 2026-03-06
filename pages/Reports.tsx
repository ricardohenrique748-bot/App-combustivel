
import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Settings,
  Search,
  Calendar,
  CarFront,
  Fuel,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useFleet } from '../FleetContext';

const Reports: React.FC = () => {
  const { transactions, vehicles } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFuel, setFilterFuel] = useState('ALL');
  const [filterSecretariat, setFilterSecretariat] = useState('ALL');

  const uniqueSecretariats = useMemo(() => {
    const secs = new Set(vehicles.map(v => v.secretariat));
    return Array.from(secs).filter(Boolean).sort();
  }, [vehicles]);

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const vehicle = vehicles.find(v => v.plate === t.plate);
      const vehicleSecretariat = vehicle?.secretariat || 'Desconhecida';

      const matchesSearch = t.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driver.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFuel = filterFuel === 'ALL' || t.fuelType === filterFuel;
      const matchesSecretariat = filterSecretariat === 'ALL' || vehicleSecretariat === filterSecretariat;

      return matchesSearch && matchesFuel && matchesSecretariat;
    });
  }, [transactions, vehicles, searchTerm, filterFuel, filterSecretariat]);

  const stats = useMemo(() => {
    const totalVolume = filteredData.reduce((acc, t) => acc + t.volume, 0);
    const totalValue = filteredData.reduce((acc, t) => acc + t.value, 0);
    const avgEfficiency = filteredData.reduce((acc, t) => acc + (t.efficiency || 0), 0) / (filteredData.length || 1);
    return { totalVolume, totalValue, avgEfficiency };
  }, [filteredData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Fuel className="text-primary w-7 h-7" />
            Relatório de Consumo de Veículos
          </h1>
          <p className="text-sm text-slate-500 font-medium">Análise detalhada de eficiência e rastreamento de combustível.</p>
        </div>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Busca Rápida</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Placa ou motorista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Secretaria</label>
            <select
              value={filterSecretariat}
              onChange={(e) => setFilterSecretariat(e.target.value)}
              className="w-full px-4 py-2 text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white"
            >
              <option value="ALL">Todas as Secretarias</option>
              {uniqueSecretariats.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo de Combustível</label>
            <select
              value={filterFuel}
              onChange={(e) => setFilterFuel(e.target.value)}
              className="w-full px-4 py-2 text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="GASOLINA">Gasolina</option>
              <option value="ETANOL">Etanol</option>
              <option value="DIESEL S10">Diesel S10</option>
              <option value="DIESEL COMUM">Diesel Comum</option>
            </select>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setFilterFuel('ALL'); setFilterSecretariat('ALL'); }}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-bold text-sm text-slate-600"
          >
            <RefreshCw className="w-4 h-4" /> Limpar Filtros
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Consumido (Filtro)</p>
          <h3 className="text-2xl font-black">{stats.totalVolume.toLocaleString()} <span className="text-xs font-bold text-slate-400">L</span></h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gasto Total (Filtro)</p>
          <h3 className="text-2xl font-black">R$ {stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Média de Eficiência</p>
          <h3 className="text-2xl font-black">{stats.avgEfficiency.toFixed(1)} <span className="text-xs font-bold text-slate-400">KM/L</span></h3>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Placa</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Motorista</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Litros</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Média</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {t.date} <br /> <span className="text-[10px] opacity-60">{t.time}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-800 font-mono">{t.plate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.driver}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{t.volume.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">R$ {t.value.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${t.efficiency && t.efficiency > 10 ? 'text-emerald-600' :
                    t.efficiency && t.efficiency < 8 ? 'text-rose-600' : 'text-slate-700'
                    }`}>
                    {t.efficiency?.toFixed(1) || '--'}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">Nenhuma transação encontrada para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
