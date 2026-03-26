
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
  secretariat_id: string; // Changed from secretariat
  driver: string;
  status: 'ACTIVE' | 'INACTIVE';
  initialMileage: number;
}

export type FuelType = 'GASOLINA' | 'DIESEL S10' | 'DIESEL COMUM' | 'ETANOL';

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
  fuel_station_id?: string;
  fuelStation?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'GESTOR' | 'SECRETARIO' | 'FISCAL';
  status: 'ACTIVE' | 'INACTIVE';
  lastAccess?: string;
  secretariatId?: string;
}

export interface FuelStation {
  id: string;
  name: string;
  address: string;
  secretariat_ids: string[];
  status: 'ACTIVE' | 'INACTIVE';
  phone?: string;
  created_at?: string;
}

export type Page = 'DASHBOARD' | 'SECRETARIATS' | 'VEHICLES' | 'SUPPLY_ENTRY' | 'REPORTS' | 'SETTINGS' | 'TRANSACTIONS' | 'FUEL_STATION';

export interface BalanceRequest {
  id: string;
  secretariat_id: string;
  fiscal_name: string;
  requested_volume: number;
  justification: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at?: string;
  updated_at?: string;
}

export interface FuelPrices {
  GASOLINA: number;
  ETANOL: number;
  DIESEL_S10: number;
  DIESEL_COMUM: number;
}

export interface SystemSettings {
  fuel_prices: FuelPrices;
}
