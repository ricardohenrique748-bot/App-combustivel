import { Secretariat, Transaction, Vehicle } from './types';

export const SECRETARIATS: Secretariat[] = [
  {
    id: "educacao",
    name: "Secretaria Municipal de Educação",
    shortName: "Educação",
    contracted: 10000,
    consumed: 0,
    remaining: 10000,
    status: 'HEALTHY'
  },
  {
    id: "social",
    name: "Secretaria Municipal de Assistência Social",
    shortName: "Assist. Social",
    contracted: 10000,
    consumed: 0,
    remaining: 10000,
    status: 'HEALTHY'
  },
  {
    id: "saude",
    name: "Secretaria Municipal de Saúde",
    shortName: "Saúde",
    contracted: 15000,
    consumed: 0,
    remaining: 15000,
    status: 'HEALTHY'
  }
];

export const RECENT_TRANSACTIONS: Transaction[] = [];

export const VEHICLES: Vehicle[] = [
  { plate: "BAO2530", model: "Hilux", secretariat: "Secretaria Municipal de Educação", driver: "Não Informado", status: "ACTIVE" },
  { plate: "EOZ0180", model: "Renault Master-Van", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "OIY8807", model: "Fiat Uno", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PSO9107", model: "Fiat Palio 1.6", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROP2A95", model: "Fiat Pulse", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "HQB9735", model: "Fiat Uno", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PSA1708", model: "Fiat Uno", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PTO4073", model: "Volkswagen Voyage", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "NWU6739", model: "Honda Bros 150", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "NWU6354", model: "Honda Titan 150", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PSL5788", model: "Toyota Hilux", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROY7A62", model: "Honda CG160", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PTS4B91", model: "Ford Ka SE 1.5", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROI1J55", model: "Chevrolet S10", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PST3631", model: "Citroën Aircross 1.6", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROP2A94", model: "Fiat Cronos", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PTS7E00", model: "Volkswagen Voyage", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PTS7E10", model: "Volkswagen Voyage", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROY2B89", model: "Fiat Cronos", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROY6J21", model: "Nissan Frontier", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "NNC5751", model: "Fiat Uno", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "SMO3D99", model: "Fiat Toro", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "PTN5067", model: "Renault Logan", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROX9H98", model: "Iveco MICRO EO", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ROX9J70", model: "Iveco MICRO EO", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "SNG1A75", model: "Fiat Mobi", secretariat: "Secretaria Municipal de Assistência Social", driver: "Não Informado", status: "ACTIVE" },
  { plate: "ABN12A1", model: "Celta", secretariat: "Secretaria Municipal de Saúde", driver: "Não Informado", status: "ACTIVE" }
];

export const CONSUMPTION_TRENDS: { date: string, amount: number }[] = [];
