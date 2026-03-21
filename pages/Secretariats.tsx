import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ArrowUpRight,
  AlertCircle,
  TrendingUp,
  Droplets,
  Edit2,
  X,
  Trash2
} from 'lucide-react';
import { useFleet } from '../FleetContext';
import { Secretariat } from '../types';
import { useAuth } from '../AuthContext';

const Secretariats: React.FC = () => {
  const { secretariats, addSecretariat, updateSecretariat, deleteSecretariat } = useFleet();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState<Secretariat | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    contracted: 0,
    consumed: 0
  });

  const handleOpenAdd = () => {
    setEditingSec(null);
    setFormData({ name: '', shortName: '', contracted: 0, consumed: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sec: Secretariat) => {
    setEditingSec(sec);
    setFormData({
      name: sec.name,
      shortName: sec.shortName,
      contracted: sec.contracted,
      consumed: sec.consumed
    });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (editingSec && window.confirm('Tem certeza que deseja excluir esta secretaria?')) {
      deleteSecretariat(editingSec.id);
      setIsModalOpen(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSec) {
      updateSecretariat(editingSec.id, formData);
    } else {
      addSecretariat(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Gestão de Secretarias</h1>
          <p className="text-sm text-slate-500">Controle de cotas e centros de custo governamentais.</p>
        </div>
        {user?.role === 'GESTOR' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Nova Secretaria
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secretariats.length > 0 ? (
          secretariats.map((s) => {
            const percentUsed = s.contracted > 0 ? (s.consumed / s.contracted) * 100 : 0;
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${s.status === 'CRITICAL' ? 'bg-rose-100 text-rose-600' :
                      s.status === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      {s.shortName}
                    </div>
                    {user?.role === 'GESTOR' && (
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-transparent hover:border-primary/10 group/btn"
                      >
                        <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-1">{s.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">ID #{s.id.substring(0, 4).toUpperCase()}</p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Consumido</p>
                        <p className="text-xl font-black text-slate-900">{s.consumed.toLocaleString()} L</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Cota Total</p>
                        <p className="text-sm font-bold text-slate-500">{s.contracted.toLocaleString()} L</p>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                        <div
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${percentUsed > 90 ? 'bg-rose-500' : percentUsed > 75 ? 'bg-amber-500' : 'bg-primary'
                            }`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className={percentUsed > 90 ? 'text-rose-600' : 'text-slate-400'}>
                          {percentUsed.toFixed(1)}% Utilizado
                        </span>
                        <span className="text-slate-400">Restam {Math.max(s.remaining, 0).toLocaleString()} L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
              <Building2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Sem Secretarias</h3>
            <p className="text-sm text-slate-500 max-w-xs text-center mt-1">
              Comece cadastrando as secretarias municipais para gerenciar as cotas de abastecimento.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800">
                {editingSec ? 'Editar Secretaria' : 'Nova Secretaria'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome da Secretaria</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Secretaria de Saúde"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Sigla</label>
                    <input
                      required
                      type="text"
                      maxLength={3}
                      value={formData.shortName}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase() })}
                      placeholder="Ex: SES"
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cota Total (L)</label>
                    <input
                      required
                      type="number"
                      value={formData.contracted || ''}
                      onChange={(e) => setFormData({ ...formData, contracted: Number(e.target.value) })}
                      placeholder="Ex: 5000"
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {editingSec && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Consumo Atual (L)</label>
                    <input
                      required
                      type="number"
                      value={formData.consumed || ''}
                      onChange={(e) => setFormData({ ...formData, consumed: Number(e.target.value) })}
                      placeholder="Ex: 1200"
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary/25"
                  >
                    {editingSec ? 'Salvar' : 'Criar'}
                  </button>
                </div>
                {editingSec && user?.role === 'GESTOR' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full mt-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir Secretaria
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Secretariats;
