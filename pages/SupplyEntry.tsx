
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CarFront,
  Search,
  FileCheck,
  Save,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp
} from 'lucide-react';
import { useFleet } from '../FleetContext';
import { Page } from '../types';

interface SupplyEntryProps {
  setCurrentPage: (page: Page) => void;
}

const SupplyEntry: React.FC<SupplyEntryProps> = ({ setCurrentPage }) => {
  const { vehicles, addTransaction } = useFleet();
  const [plate, setPlate] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [pricePerLiter, setPricePerLiter] = useState(5.899);
  const [fuelType, setFuelType] = useState<'GASOLINA' | 'DIESEL S10' | 'DIESEL COMUM' | 'ETANOL'>('GASOLINA');
  const [success, setSuccess] = useState(false);

  const selectedVehicle = useMemo(() =>
    vehicles.find(v => v.plate === plate.toUpperCase()),
    [plate, vehicles]);

  const totalCost = useMemo(() => quantity * pricePerLiter, [quantity, pricePerLiter]);

  const handleConfirm = () => {
    if (!selectedVehicle || quantity <= 0) {
      alert('Por favor, identifique um veículo válido e insira a quantidade.');
      return;
    }

    const now = new Date();
    addTransaction({
      date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      plate: selectedVehicle.plate,
      driver: selectedVehicle.driver,
      fuelType: fuelType,
      volume: quantity,
      value: totalCost,
      status: 'VERIFIED',
      efficiency: 10 + Math.random() * 5 // Mock efficiency
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrentPage('DASHBOARD');
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Lançamento Realizado!</h2>
        <p className="text-slate-500 mt-2">Os dados da frota foram atualizados em tempo real.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => setCurrentPage('DASHBOARD')} className="flex items-center text-primary font-bold text-sm hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Dashboard
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Entrada de Abastecimento</h2>
        <p className="text-slate-500">Registre um novo evento de reabastecimento para a frota oficial.</p>
      </div>

      {selectedVehicle && (
        <div className="mb-8 bg-blue-50 border-l-4 border-primary p-4 rounded-xl flex gap-4 animate-in fade-in">
          <Info className="text-primary w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-primary">Veículo Identificado</p>
            <p className="text-sm text-blue-700">Responsável: <strong>{selectedVehicle.driver}</strong> | Secretaria: <strong>{selectedVehicle.secretariat}</strong></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <CarFront className="w-5 h-5" />
              <h3 className="font-black uppercase text-xs tracking-widest">Identificação do Veículo</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Placa do Veículo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    className={`w-full bg-slate-50 border ${selectedVehicle ? 'border-emerald-500' : 'border-slate-200'} rounded-xl p-4 text-xl font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                    placeholder="AAA-0000"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                {!selectedVehicle && plate.length >= 7 && (
                  <p className="text-rose-500 text-xs mt-2 font-bold">Placa não encontrada na base da frota.</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <FileCheck className="w-5 h-5" />
              <h3 className="font-black uppercase text-xs tracking-widest">Detalhes do Abastecimento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Tipo de Combustível</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFuelType('GASOLINA')}
                    className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${fuelType === 'GASOLINA' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}
                  >Gasolina</button>
                  <button
                    onClick={() => setFuelType('ETANOL')}
                    className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${fuelType === 'ETANOL' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}
                  >Etanol</button>
                  <button
                    onClick={() => setFuelType('DIESEL S10')}
                    className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${fuelType === 'DIESEL S10' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}
                  >Diesel S10</button>
                  <button
                    onClick={() => setFuelType('DIESEL COMUM')}
                    className={`py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${fuelType === 'DIESEL COMUM' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}
                  >Diesel Comum</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Quantidade (Litros)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 font-bold text-primary text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">L</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Valor por Litro (R$)</label>
                <input
                  type="number"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(Number(e.target.value))}
                  step="0.001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-primary text-white p-8 rounded-2xl shadow-xl shadow-primary/30 sticky top-6">
            <h3 className="font-bold uppercase text-[10px] tracking-widest mb-6 opacity-70">Resumo da Operação</h3>
            <div className="space-y-6">
              <div className="border-b border-white/20 pb-4">
                <span className="text-sm block opacity-70 mb-1">Custo Total</span>
                <span className="text-4xl font-black">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <button
                onClick={handleConfirm}
                disabled={!selectedVehicle || quantity <= 0}
                className="w-full bg-white text-primary font-black py-4 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 mt-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <Save className="w-5 h-5" />
                CONFIRMAR LANÇAMENTO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyEntry;
