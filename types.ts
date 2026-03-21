
export interface Secretariat {
  id: string;
  name: string;
  shortName: string;
  contracted: number;
  consumed: number;
  remaining: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface Vehicle {
  plate: string;
  model: string;
  secretariat: string;
  driver: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  plate: string;
  driver: string;
  fuelType: 'GASOLINA' | 'DIESEL S10' | 'DIESEL COMUM' | 'ETANOL';
  volume: number;
  value: number;
  status: 'VERIFIED' | 'PENDING';
  efficiency?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'GESTOR' | 'SECRETARIO' | 'FISCAL';
  status: 'ACTIVE' | 'INACTIVE';
  lastAccess?: string;
  secretariatId?: string;
}

export type Page = 'DASHBOARD' | 'SECRETARIATS' | 'VEHICLES' | 'SUPPLY_ENTRY' | 'REPORTS' | 'SETTINGS';
