// types/Alerts.ts


export interface AlertItem {
  id: string;
  title: string;
  description: string;
  alert_type: 'emergency' | 'warning' | 'info' | 'ongoing';
  severity: 'critical' | 'high' | 'medium' | 'low';
  start_time: string; // ISO string
  end_time?: string; // ISO string
  is_active: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
