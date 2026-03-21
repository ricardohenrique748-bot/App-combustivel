import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { Secretariat, Vehicle, Transaction } from './types';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

interface FleetContextType {
  secretariats: Secretariat[];
  vehicles: Vehicle[];
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addSecretariat: (secretariat: { name: string; shortName: string; contracted: number; consumed?: number; notes?: string }) => Promise<void>;
  updateSecretariat: (id: string, updates: Partial<Secretariat>) => Promise<void>;
  deleteSecretariat: (id: string) => Promise<void>;
  addVehicle: (vehicle: Vehicle) => Promise<void>;
  updateVehicle: (plate: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (plate: string) => Promise<void>;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [secretariats, setSecretariats] = useState<Secretariat[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const [secRes, vehRes, txtRes] = await Promise.all([
        supabase.from('secretariats').select('*'),
        supabase.from('vehicles').select('*'),
        supabase.from('transactions').select('*').order('date', { ascending: false }).order('time', { ascending: false })
      ]);

      if (secRes.data) setSecretariats(secRes.data as Secretariat[]);
      if (vehRes.data) setVehicles(vehRes.data as Vehicle[]);
      if (txtRes.data) setTransactions(txtRes.data as Transaction[]);
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const transaction: Transaction = {
      ...newTx,
      id
    };

    // Salvar transaction no supabase
    const { error } = await supabase.from('transactions').insert([transaction]);
    if (error) {
      console.error("Erro ao adicionar transação:", error);
      return;
    }

    setTransactions(prev => [transaction, ...prev]);

    // Update Secretariat consumption
    const vehicle = vehicles.find(v => v.plate === newTx.plate);
    if (vehicle) {
      // Find the correct secretariat based on vehicle exact secretariat string
      const secretariat = secretariats.find(s => s.name === vehicle.secretariat);

      if (secretariat) {
        const newConsumed = secretariat.consumed + newTx.volume;
        const newRemaining = secretariat.contracted - newConsumed;
        const newStatus = newRemaining < secretariat.contracted * 0.1 ? 'CRITICAL' : newRemaining < secretariat.contracted * 0.25 ? 'WARNING' : 'HEALTHY';

        const updates = {
          consumed: newConsumed,
          remaining: newRemaining,
          status: newStatus
        };

        const { error: secError } = await supabase.from('secretariats').update(updates).eq('id', secretariat.id);

        if (!secError) {
          setSecretariats(prev => prev.map(s => {
            if (s.id === secretariat.id) return { ...s, ...updates };
            return s;
          }));
        }
      }
    }
  };

  const addSecretariat = async (newSec: { name: string; shortName: string; contracted: number; consumed?: number; notes?: string }) => {
    const consumed = newSec.consumed || 0;
    const remaining = newSec.contracted - consumed;
    const id = Math.random().toString(36).substr(2, 9);
    const status = remaining < newSec.contracted * 0.1 ? 'CRITICAL' :
      remaining < newSec.contracted * 0.25 ? 'WARNING' : 'HEALTHY';

    const secretariat: Secretariat = {
      ...newSec,
      id,
      consumed,
      remaining,
      status
    };

    const { error } = await supabase.from('secretariats').insert([secretariat]);

    if (!error) {
      setSecretariats(prev => [...prev, secretariat]);
    } else {
      console.error("Erro ao adicionar secretaria:", error);
    }
  };

  const updateSecretariat = async (id: string, updates: Partial<Secretariat>) => {
    const target = secretariats.find(s => s.id === id);
    if (!target) return;

    const newContracted = updates.contracted ?? target.contracted;
    const newConsumed = updates.consumed ?? target.consumed;
    const newRemaining = newContracted - newConsumed;
    const newStatus = newRemaining < newContracted * 0.1 ? 'CRITICAL' :
      newRemaining < newContracted * 0.25 ? 'WARNING' : 'HEALTHY';

    const fullUpdates = {
      ...updates,
      remaining: newRemaining,
      status: newStatus
    };

    const { error } = await supabase.from('secretariats').update(fullUpdates).eq('id', id);

    if (!error) {
      // Registrar no histórico se houver mudança de valor
      if (updates.contracted !== undefined && updates.contracted !== target.contracted) {
        await supabase.from('secretariat_history').insert([{
          secretariat_id: id,
          type: 'CONTRATADO',
          old_value: target.contracted,
          new_value: updates.contracted,
          change_value: updates.contracted - target.contracted,
          user_email: user?.email,
          description: 'Ajuste manual de cota contratada'
        }]);
      }
      if (updates.consumed !== undefined && updates.consumed !== target.consumed) {
        await supabase.from('secretariat_history').insert([{
          secretariat_id: id,
          type: 'CONSUMO',
          old_value: target.consumed,
          new_value: updates.consumed,
          change_value: updates.consumed - target.consumed,
          user_email: user?.email,
          description: 'Ajuste manual de consumo acumulado'
        }]);
      }

      setSecretariats(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, ...fullUpdates };
        }
        return s;
      }));
    } else {
      console.error("Erro ao atualizar secretaria:", error);
    }
  };

  const deleteSecretariat = async (id: string) => {
    const { error } = await supabase.from('secretariats').delete().eq('id', id);
    if (!error) {
      setSecretariats(prev => prev.filter(s => s.id !== id));
    } else {
      console.error("Erro ao excluir secretaria:", error);
    }
  };

  const addVehicle = async (vehicle: Vehicle) => {
    const { error } = await supabase.from('vehicles').insert([vehicle]);
    if (!error) {
      setVehicles(prev => [...prev, vehicle]);
    } else {
      console.error("Erro ao adicionar veículo:", error);
    }
  };

  const updateVehicle = async (plate: string, updates: Partial<Vehicle>) => {
    const { error } = await supabase.from('vehicles').update(updates).eq('plate', plate);
    if (!error) {
      setVehicles(prev => prev.map(v => v.plate === plate ? { ...v, ...updates } : v));
    } else {
      console.error("Erro ao atualizar veículo:", error);
    }
  };

  const deleteVehicle = async (plate: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('plate', plate);
    if (!error) {
      setVehicles(prev => prev.filter(v => v.plate !== plate));
    } else {
      console.error("Erro ao excluir veículo:", error);
    }
  };

  const filteredSecretariats = useMemo(() => {
    if (user?.role === 'SECRETARIO' && user?.secretariatId) {
      return secretariats.filter(s => 
        s.id === user.secretariatId || 
        s.shortName === user.secretariatId || 
        s.name === user.secretariatId
      );
    }
    return secretariats;
  }, [secretariats, user]);

  const filteredVehicles = useMemo(() => {
    if (user?.role === 'SECRETARIO') {
      const allowedSecs = filteredSecretariats.map(s => s.name);
      return vehicles.filter(v => allowedSecs.includes(v.secretariat));
    }
    return vehicles;
  }, [vehicles, filteredSecretariats, user]);

  const filteredTransactions = useMemo(() => {
    if (user?.role === 'SECRETARIO') {
      const allowedPlates = filteredVehicles.map(v => v.plate);
      return transactions.filter(t => allowedPlates.includes(t.plate));
    }
    return transactions;
  }, [transactions, filteredVehicles, user]);

  return (
    <FleetContext.Provider value={{
      secretariats: filteredSecretariats,
      vehicles: filteredVehicles,
      transactions: filteredTransactions,
      addTransaction,
      addSecretariat,
      updateSecretariat,
      deleteSecretariat,
      addVehicle,
      updateVehicle,
      deleteVehicle
    }}>
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) throw new Error('useFleet must be used within a FleetProvider');
  return context;
};
