// types/FuelData.ts

export interface FuelOption {
  id: string;
  label: string;
  capacity?: number;
  remaining?: number;
  price?: number;
  value: string;
  color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  lastFueling?: Date;
  remarks?: string;
  updated_at: string;
  created_at: string;
  last_fuel_tank_refueling?: string;
}

// Fuelings

export interface FuelingValues {
  id: string;
  aircraft: string;
  amount: number;
  fuel: string;
  uid: string;
  created_at: string;
  price: number;
  billed_to: string;
  billed_to_type: string;
}
export interface FuelItem extends FuelingValues {
  id: string;
  created_at: string;
}
export interface ProcessedFuelData {
    month: string;
    amount: number;
}
export interface FuelStats {
    totalYTD: number;
    currentMonth: number;
    monthlyAverage: number;
}
export interface FuelTypeUsage {
  name: string;
  total: number;
  color: string;
}

export interface FuelType {
  id: string;
  label: string;
  color: string;
}