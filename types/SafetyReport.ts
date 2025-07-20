// types/SafetyReport.ts

export type ReportStatus = 'open' | 'in-progress' | 'resolved';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReportCategory = 'inflight' | 'infrastructure' | 'aircraft' | 'medical' | 'security' | 'enviromental' | 'communication' | 'other';

export interface SafetyReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  severity: SeverityLevel;
  reported_by: string; 
  reported_at: string;
  resolved_at?: string;
  location?: string;
  comments?: string;
}

export interface CreateSafetyReport {
  title: string;
  description: string;
  category: ReportCategory;
  severity: SeverityLevel;
  location?: string;
}

export interface UpdateSafetyReport {
  title?: string;
  description?: string;
  category?: ReportCategory;
  status?: ReportStatus;
  severity?: SeverityLevel;
  resolved_at?: string;
  location?: string;
  comments?: string;
}