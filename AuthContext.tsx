import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Ricardo Henrique',
    email: 'ricardo.luz@eunaman.com.br',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastAccess: 'Agora'
  },
  {
    id: '2',
    name: 'Administrador Prefeitura',
    email: 'admin@prefeitura.gov.br',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastAccess: 'Ontem, 14:30'
  },
  {
    id: '3',
    name: 'Gestor de Transportes',
    email: 'gestor@prefeitura.gov.br',
    role: 'MANAGER',
    status: 'ACTIVE',
    lastAccess: 'Há 2 dias'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUsers;
      }
    }
    return defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('app_current_user');
    }
  }, [currentUser]);

  const login = (email: string) => {
    const found = users.find(u => u.email === email && u.status === 'ACTIVE');
    if (found) {
      // Atualizar o último acesso para "Agora"
      const updatedUser = { ...found, lastAccess: 'Agora' };
      setCurrentUser(updatedUser);
      updateUser(updatedUser.id, updatedUser);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addUser = (user: User) => setUsers(prev => [...prev, user]);

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, users, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
