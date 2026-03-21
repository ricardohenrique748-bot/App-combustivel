import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (!error && data) {
      // Map back database fields if they differ from camelCase types
      const mappedUsers = data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        lastAccess: u.last_access,
        secretariatId: u.secretariat_id
      }));
      setUsers(mappedUsers);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('app_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário salvo:", e);
      }
    }
    loadUsers().finally(() => setLoading(false));
  }, []);

  const login = async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('status', 'ACTIVE')
      .single();

    if (!error && data) {
      const now = new Date().toLocaleString('pt-BR');
      const mappedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as any,
        status: data.status as any,
        lastAccess: now,
        secretariatId: data.secretariat_id
      };
      
      // Update last access in DB
      await supabase.from('users').update({ last_access: now }).eq('id', data.id);
      
      setCurrentUser(mappedUser);
      localStorage.setItem('app_current_user', JSON.stringify(mappedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_current_user');
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newUser = { ...user, id };
    
    const { error } = await supabase.from('users').insert([{
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      secretariat_id: newUser.secretariatId
    }]);

    if (!error) {
      setUsers(prev => [...prev, newUser]);
    } else {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.role) dbUpdates.role = updates.role;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.secretariatId !== undefined) dbUpdates.secretariat_id = updates.secretariatId;

    const { error } = await supabase.from('users').update(dbUpdates).eq('id', id);

    if (!error) {
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
      if (currentUser?.id === id) {
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        localStorage.setItem('app_current_user', JSON.stringify(updatedUser));
      }
    } else {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (currentUser?.id === id) {
        logout();
      }
    } else {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, users, loading, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

