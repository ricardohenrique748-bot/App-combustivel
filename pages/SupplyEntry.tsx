
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, CarFront, Search, FileCheck, Save,
  CheckCircle2, Info, ChevronDown, DollarSign,
  Droplet, Building2, Fuel
} from 'lucide-react';
import { useFleet } from '../FleetContext';
import { Page } from '../types';

interface SupplyEntryProps {
  setCurrentPage: (page: Page) => void;
}

const SupplyEntry: React.FC<SupplyEntryProps> = ({ setCurrentPage }) => {
  const { vehicles, secretariats, addTransaction } = useFleet();
  const [selectedSecretariat, setSelectedSecretariat] = useState('');
  const [plate, setPlate] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [pricePerLiter, setPricePerLiter] = useState<number>(5.899);
  const [fuelType, setFuelType] = useState<'GASOLINA' | 'DIESEL S10' | 'DIESEL COMUM' | 'ETANOL'>('GASOLINA');
  const [success, setSuccess] = useState(false);

  const filteredVehicles = useMemo(() => {
    if (!selectedSecretariat) return [];
    return vehicles.filter(v => v.secretariat === selectedSecretariat && v.status === 'ACTIVE');
  }, [vehicles, selectedSecretariat]);

  const selectedVehicle = useMemo(() =>
    vehicles.find(v => v.plate === plate.toUpperCase()),
    [plate, vehicles]);

  const totalCost = useMemo(() => (Number(quantity) || 0) * pricePerLiter, [quantity, pricePerLiter]);

  const handleConfirm = () => {
    if (!selectedVehicle || Number(quantity) <= 0) {
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
      volume: Number(quantity),
      value: totalCost,
      status: 'VERIFIED',
      efficiency: 10 + Math.random() * 5
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrentPage('DASHBOARD');
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Lançamento Realizado!</h2>
        <p className="text-slate-500 mt-2">O abastecimento foi registrado com sucesso.</p>
      </div>
    );
  }

  const fuelTypes = [
    { id: 'GASOLINA', label: 'Gasolina' },
    { id: 'ETANOL', label: 'Etanol' },
    { id: 'DIESEL S10', label: 'Diesel S10' },
    { id: 'DIESEL COMUM', label: 'Diesel Comum' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => setCurrentPage('DASHBOARD')} 
        className="group flex items-center text-slate-500 hover:text-primary font-medium text-sm transition-colors mb-8"
      >
        <div className="bg-white p-1.5 rounded-lg border border-slate-200 mr-3 shadow-sm group-hover:border-primary/30 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Voltar para Dashboard
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Entrada de Abastecimento</h2>
        <p className="text-slate-500 mt-1">Registre um novo evento de reabastecimento para a frota oficial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Identificação Section */}
          <section className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-visible">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-primary rounded-l-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 pl-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <CarFront className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 tracking-tight">Identificação do Veículo</h3>
            </div>
            
            <div className="space-y-6 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Secretaria Responsável</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Building2 className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    value={selectedSecretariat}
                    onChange={(e) => {
                      setSelectedSecretariat(e.target.value);
                      setPlate('');
                    }}
                    className="relative w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-slate-700 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                  >
                    <option value="">Selecione uma secretaria...</option>
                    {secretariats.map(sec => (
                      <option key={sec.id} value={sec.name}>{sec.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-focus-within:rotate-180" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Placa do Veículo (Busca Rápida)</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Search className={`w-5 h-5 transition-colors ${selectedVehicle ? 'text-emerald-500' : 'text-slate-400 group-focus-within:text-primary'}`} />
                  </div>
                  <select
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    disabled={!selectedSecretariat}
                    className={`relative w-full bg-slate-50/50 border ${
                      selectedVehicle 
                        ? 'border-emerald-300 ring-4 ring-emerald-50 bg-emerald-50/50 text-emerald-800' 
                        : 'border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary hover:border-slate-300 hover:bg-slate-50'
                    } rounded-2xl pl-12 pr-12 py-3.5 text-base font-semibold tracking-wide outline-none transition-all appearance-none ${!selectedSecretariat ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'cursor-pointer'}`}
                  >
                    <option value="">{selectedSecretariat ? 'Selecionar Placa...' : 'Aguardando secretaria...'}</option>
                    {filteredVehicles.map(v => (
                      <option key={v.plate} value={v.plate}>{v.plate} • {v.model}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    {selectedVehicle ? (
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                       <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-focus-within:rotate-180" />
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Context Info */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedVehicle ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                {selectedVehicle && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50/30 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-emerald-50">
                       <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-800 text-sm">Pronto para abastecer</h4>
                      <p className="text-sm text-emerald-700/80 mt-0.5">Veículo vinculado a <strong className="font-semibold text-emerald-700">{selectedVehicle.driver}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Setup Detalhes Section */}
          <section className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-visible">
             <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 pl-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Fuel className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 tracking-tight">Dados do Abastecimento</h3>
            </div>
            
            <div className="space-y-8 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 block">Tipo de Combustível</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                  {fuelTypes.map(ft => (
                    <button
                      key={ft.id}
                      onClick={() => setFuelType(ft.id)}
                      className={`py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-300 flex justify-center items-center ${
                        fuelType === ft.id 
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200 scale-[1.02]' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Volume Abastecido</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Droplet className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-slate-800 font-semibold text-lg focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none transition-all hover:border-slate-300 hover:bg-slate-50"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                      <span className="text-slate-400 font-bold text-xs uppercase bg-slate-200/50 px-2 py-1 rounded-md">L</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Valor na Bomba (R$/L)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <DollarSign className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="number"
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(Number(e.target.value))}
                      step="0.01"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 py-3.5 text-slate-800 font-semibold text-lg focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none transition-all hover:border-slate-300 hover:bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sticky Summary */}
        <div className="space-y-6 lg:mt-0 mt-6 relative z-10">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/20 sticky top-8 border border-slate-700/50 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-widest mb-8">Resumo da Operação</h3>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <span className="text-sm font-medium text-slate-300 block mb-2">Custo Estimado da Operação</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-400">R$</span>
                    <span className="text-5xl font-black tracking-tight text-white">
                      {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  {Boolean(quantity) && quantity !== '' && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-slate-300">
                      <span>Volume: <strong className="text-white">{quantity} Litros</strong></span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{fuelType}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConfirm}
                    disabled={!selectedVehicle || Number(quantity) <= 0}
                    className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-primary active:scale-[0.98]"
                  >
                    <Save className="w-5 h-5" />
                    CONFIRMAR TRANSAÇÃO
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4 opacity-70">
                    Ao confirmar, o volume será subtraído da cota da secretaria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyEntry;
