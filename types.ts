export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeFrame: string;
  rationale: string;
  ema?: string;
  superTrend?: string;
  pegRatio?: number;
  debtToEquity?: number;
  rsi?: number;
  volumeAction?: string;
  buyAlert?: number;
  technicalTrigger?: string;
  entryPrice?: number;
  returnPercentage?: number;
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
