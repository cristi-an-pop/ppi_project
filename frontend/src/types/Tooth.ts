export interface Tooth {
  id: string;
  clientId: string;
  number: number;
  severity?: string;
  size?: number;
}

export type ToothSeverity = 'healthy' | 'low' | 'medium' | 'high' | 'missing';

