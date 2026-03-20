export enum SafetyStatus {
  SAFE = 'SAFE',
  UNSAFE = 'UNSAFE',
  UNKNOWN = 'UNKNOWN',
}

export interface ThreatDetail {
  type: string;
  description: string;
}

export interface AnalysisResult {
  safetyStatus: SafetyStatus;
  reason: string;
  threats: ThreatDetail[];
}

export interface HistoryItem {
  timestamp: number;
  url: string;
  result: AnalysisResult;
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishedDate: string;
}
