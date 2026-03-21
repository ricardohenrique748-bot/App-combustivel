
export interface Secretariat {
  id: string;
  name: string;
  shortName: string;
  contracted: number;
  consumed: number;
  remaining: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  notes?: string;
}

export interface SecretariatHistory {
  id: string;
  secretariat_id: string;
  date: string;
  type: 'CONTRATADO' | 'CONSUMO';
  old_value: number;
  new_value: number;
  change_value: number;
  user_email?: string;
  description?: string;
}

export interface Vehicle {
  plate: string;
  model: string;
  secretariat: string;
  driver: string;
  status: 'ACTIVE' | 'INACTIVE';
  initialMileage: number;
}

export type FuelType = 'GASOLINA' | 'DIESEL S10' | 'DIESEL S500' | 'ETANOL';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  plate: string;
  driver: string;
  fuelType: FuelType;
  volume: number;
  value: number;
  currentMileage: number;
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

export type Page = 'DASHBOARD' | 'SECRETARIATS' | 'VEHICLES' | 'SUPPLY_ENTRY' | 'REPORTS' | 'SETTINGS' | 'TRANSACTIONS';
