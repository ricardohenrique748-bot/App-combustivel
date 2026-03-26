
import React, { useState, useMemo } from 'react';
import {
  Search,
  Fuel,
  RefreshCw,
  History,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Car
} from 'lucide-react';
import { useFleet } from '../FleetContext';
import { Transaction } from '../types';

const Transactions: React.FC = () => {
  const { transactions, vehicles, fuelStations } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFuel, setFilterFuel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driver.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFuel = filterFuel === 'ALL' || t.fuelType === filterFuel;
      const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;

      return matchesSearch && matchesFuel && matchesStatus;
    });
  }, [transactions, searchTerm, filterFuel, filterStatus]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <History className="text-primary w-7 h-7" />
            Histórico de Transações
          </h1>
          <p className="text-sm text-slate-500 font-medium">Visualize e monitore todos os abastecimentos realizados no sistema.</p>
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
                className="w-full pl-10 pr-4 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo de Combustível</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={filterFuel}
                onChange={(e) => setFilterFuel(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all appearance-none"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="GASOLINA">Gasolina</option>
                <option value="DIESEL S500">Diesel S500</option>
                <option value="DIESEL S10">Diesel S10</option>
                <option value="ETANOL">Etanol</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</label>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all appearance-none"
              >
                <option value="ALL">Todos os Status</option>
                <option value="VERIFIED">Verificado</option>
                <option value="PENDING">Pendente</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setFilterFuel('ALL'); setFilterStatus('ALL'); }}
            className="h-[42px] px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-bold text-sm text-slate-600 hover:text-primary hover:border-primary/30 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Limpar Filtros
          </button>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Data & Hora</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Veículo / Motorista</th>
                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Combustível</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Posto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 text-center">Volume (L)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">Valor Total</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {t.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        {t.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Car className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 font-mono tracking-tight uppercase">{t.plate}</span>
                        <span className="text-xs font-medium text-slate-500">{t.driver}</span>
                      </div>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700">{t.fuelType}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tipo Regular</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {fuelStations.find(fs => fs.id === t.fuel_station_id)?.name || t.fuelStation || 'Não informado'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-slate-800">{t.volume.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1">L</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">
                      R$ {t.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        t.status === 'VERIFIED' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status === 'VERIFIED' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verificado
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Pendente
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Search className="w-12 h-12 mb-4 text-slate-300" />
                      <p className="text-slate-500 font-bold">Nenhuma transação encontrada.</p>
                      <p className="text-slate-400 text-xs mt-1">Tente ajustar seus filtros de busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">Exibindo {filteredData.length} registros</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors disabled:opacity-30" disabled>Anterior</button>
              <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors disabled:opacity-30" disabled>Próxima</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Transactions;
