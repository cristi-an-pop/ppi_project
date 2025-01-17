export interface Tooth {
  id: string;
  clientId: string;
  number: number;
  class: number;
  severity?: string;
  size?: number;
  problem: number;
  description: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export type ToothSeverity = 'healthy' | 'low' | 'medium' | 'high' | 'missing';

