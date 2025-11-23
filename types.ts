export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  targetPrice: number; // Used as "Projected Target" in analysis, or "Current Value" placeholder
  stopLoss: number;
  timeFrame: string;
  rationale: string;
  ema?: string;
  superTrend?: string;
  
  // New Auditor Metrics
  pegRatio?: number;      // Fundamental: Value < 1.5 is ideal
  debtToEquity?: number;  // Fundamental: Safety check
  rsi?: number;           // Technical: Momentum check (0-100)
  volumeAction?: string;  // Technical: e.g., "2x Avg Volume"

  // Alerts
  buyAlert?: number;          // Fundamental: "Buy if price drops to..."
  technicalTrigger?: string;  // Technical: "Alert if Volume > X" or "Alert if crosses Y"

  // Backtest specific fields
  entryPrice?: number; // Price at the start of the backtest period
  returnPercentage?: number; // Realized return
}

export enum AnalysisType {
  FUNDAMENTAL = 'FUNDAMENTAL',
  TECHNICAL = 'TECHNICAL',
  BACKTEST = 'BACKTEST',
}

export enum BacktestStrategy {
  FUNDAMENTAL = 'FUNDAMENTAL',
  TECHNICAL = 'TECHNICAL',
}

export enum AnalysisState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface AnalysisResult {
  type: AnalysisType;
  summary: string;
  stocks: StockData[];
  sources: Array<{ uri: string; title: string }>;
  backtestPeriod?: string;
  backtestStrategy?: BacktestStrategy;
}
