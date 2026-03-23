import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, ShieldCheck, Zap, Activity, ChevronRight, Globe, LockKeyhole } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('E-mail ou senha incorretos, ou usuário inativo.');
      }
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar realizar o login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] relative overflow-hidden font-sans selection:bg-primary-500/30">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] rounded-full bg-indigo-600/15 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full px-6 py-12 flex justify-center items-center z-10">

        {/* Login Form Header & Card */}
        <div className="w-full max-w-[480px]">
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary/30">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              Smart <span className="text-primary-500">Tech</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Gestão Inteligente de Frotas</p>
          </div>

          <div className="relative group/card">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-[32px] blur opacity-25 group-hover/card:opacity-40 transition duration-1000 group-hover/card:duration-200"></div>

            <div className="relative bg-[#161b22]/80 backdrop-blur-2xl rounded-[30px] border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-10">
                <div className="flex justify-between items-end mb-10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none">Login</h2>
                    <p className="text-slate-500 text-sm font-medium">Bem vindo de volta ao sistema.</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <LockKeyhole size={16} />
                    </div>
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">E-mail Corporativo</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-600 group-focus-within/input:text-primary-400 transition-colors duration-200" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all duration-300 sm:text-sm font-medium"
                        placeholder="nome@prefeitura.gov.br"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Senha de Acesso</label>
                      <a href="#" className="text-[11px] font-black uppercase tracking-[0.1em] text-primary-400 hover:text-primary-300 transition-colors">Esqueceu?</a>
                    </div>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-600 group-focus-within/input:text-primary-400 transition-colors duration-200" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all duration-300 sm:text-sm font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/50 transition-all duration-300 shadow-xl shadow-primary-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-primary-600/40"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Autenticando
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Acessar Painel <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-tighter mb-1">
                    <ShieldCheck size={12} /> SECURE GATEWAY INFRASTRUCTURE
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.05em] text-center">
                    Authorized use only. Session monitored for audit.
                  </p>
                </div>
              </div>

              {/* Decorative accent lines */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-500/10 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-10 left-10 text-[10px] font-black text-slate-700/50 tracking-widest hidden md:block">
        BUILD VERSION 2.8.4 // REGION: BR-LUC
      </div>
    </div>
  );
};

export default Login;

