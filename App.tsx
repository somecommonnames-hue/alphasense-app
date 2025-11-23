import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { StockList } from './components/StockList';
import { StockChart } from './components/StockChart';
import { analyzeStocks } from './services/geminiService';
import { AnalysisState, AnalysisResult, AnalysisType, BacktestStrategy } from './types';
import { Search, AlertTriangle, ExternalLink, CandlestickChart, LineChart, History, Radar, Download } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<AnalysisType | null>(null);
  const [activeBacktestStrategy, setActiveBacktestStrategy] = useState<BacktestStrategy | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  const handleAnalyze = useCallback(async (type: AnalysisType, backtestPeriod?: string, backtestStrategy?: BacktestStrategy) => {
    setState(AnalysisState.ANALYZING);
    setActiveType(type);
    setActiveBacktestStrategy(backtestStrategy || null);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeStocks(type, backtestPeriod, backtestStrategy);
      setResult(data);
      setState(AnalysisState.COMPLETE);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setState(AnalysisState.ERROR);
    }
  }, []);

  const fundamentalTimeFrames = ['3 Years', '5 Years', '10 Years', '15 Years', '20 Years'];
  const technicalTimeFrames = ['2 Weeks', '4 Weeks', '6 Weeks', '3 Months', '6 Months'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {deferredPrompt && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
             <button onClick={handleInstallClick} className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 rounded-full px-5 py-3 flex items-center gap-3 shadow-2xl">
               <Download className="w-5 h-5" />
               <div className="flex flex-col items-start"><span className="text-xs opacity-80">Get Android App</span><span className="text-sm font-bold">Install AlphaSense</span></div>
             </button>
          </div>
        )}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-blue-400 mb-6 shadow-inner">
            <Radar className="w-3 h-3 animate-pulse" /><span>Now Scanning Nifty 200 Live Data</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Unlock Market Alpha with <br /><span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Precision</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">AlphaSense is your personal AI Auditor. We scan Global Macros, Wars, Oil, and Sector Trends to find the perfect Fundamental or Technical setups.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-12">
            <button onClick={() => handleAnalyze(AnalysisType.FUNDAMENTAL)} disabled={state === AnalysisState.ANALYZING}
              className={`relative w-full sm:w-auto min-w-[260px] group flex items-center justify-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 border ${activeType === AnalysisType.FUNDAMENTAL && state === AnalysisState.ANALYZING ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 text-white border-transparent'}`}>
              <div className="bg-white/10 p-2 rounded-lg"><LineChart className="w-6 h-6 text-white" /></div>
              <div className="text-left"><div className="font-bold text-lg">Fundamental Audit</div><div className="text-[11px] opacity-80 font-medium">Find Multi-Baggers</div></div>
            </button>
            <button onClick={() => handleAnalyze(AnalysisType.TECHNICAL)} disabled={state === AnalysisState.ANALYZING}
              className={`relative w-full sm:w-auto min-w-[260px] group flex items-center justify-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 border ${activeType === AnalysisType.TECHNICAL && state === AnalysisState.ANALYZING ? 'bg-orange-600/10 border-orange-500/30 text-orange-400' : 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700'}`}>
              <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20"><CandlestickChart className="w-6 h-6 text-orange-400" /></div>
              <div className="text-left"><div className="font-bold text-lg">Technical Sniper</div><div className="text-[11px] text-slate-400 font-medium">Short Term Momentum</div></div>
            </button>
          </div>
          <div className="w-full max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2"><History className="w-4 h-4 text-purple-400" /><h3 className="text-sm font-bold text-slate-300">Strategy Backtest Lab</h3></div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-32 shrink-0 text-sm font-medium text-slate-400">Fundamental</div>
                 <div className="flex flex-wrap gap-2 w-full">
                    {fundamentalTimeFrames.map((period) => (
                      <button key={period} onClick={() => handleAnalyze(AnalysisType.BACKTEST, period, BacktestStrategy.FUNDAMENTAL)} disabled={state === AnalysisState.ANALYZING}
                        className={`flex-1 min-w-[80px] px-3 py-2 text-xs font-semibold rounded-lg transition-all border border-slate-800 ${activeType === AnalysisType.BACKTEST && activeBacktestStrategy === BacktestStrategy.FUNDAMENTAL && state === AnalysisState.ANALYZING ? 'opacity-50' : 'bg-slate-800/50 hover:bg-purple-600 hover:text-white'}`}>{period}</button>
                    ))}
                 </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="w-32 shrink-0 text-sm font-medium text-slate-400">Technical</div>
                 <div className="flex flex-wrap gap-2 w-full">
                    {technicalTimeFrames.map((period) => (
                      <button key={period} onClick={() => handleAnalyze(AnalysisType.BACKTEST, period, BacktestStrategy.TECHNICAL)} disabled={state === AnalysisState.ANALYZING}
                        className={`flex-1 min-w-[80px] px-3 py-2 text-xs font-semibold rounded-lg transition-all border border-slate-800 ${activeType === AnalysisType.BACKTEST && activeBacktestStrategy === BacktestStrategy.TECHNICAL && state === AnalysisState.ANALYZING ? 'opacity-50' : 'bg-slate-800/50 hover:bg-pink-600 hover:text-white'}`}>{period}</button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
        {state === AnalysisState.ERROR && (
          <div className="max-w-3xl mx-auto mb-12 bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-start gap-4"><AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" /><div><h3 className="text-lg font-semibold text-red-400 mb-1">Analysis Failed</h3><p className="text-red-200/80">{error}</p><button onClick={() => setState(AnalysisState.IDLE)} className="mt-3 text-sm font-medium text-red-400 underline">Try Again</button></div></div>
        )}
        {state === AnalysisState.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6"><div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div><div className="text-center"><p className="text-xl font-medium text-white animate-pulse">Analyzing Nifty 200 Data...</p><p className="text-slate-500 mt-2">Checking Oil, Bonds, War News • Verifying Prices</p></div></div>
        )}
        {state === AnalysisState.COMPLETE && result && (
          <div className="space-y-10">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                <div className={`absolute left-0 top-0 w-1 h-full ${result.type === AnalysisType.FUNDAMENTAL ? 'bg-blue-500' : result.type === AnalysisType.TECHNICAL ? 'bg-orange-500' : 'bg-purple-500'}`}></div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-slate-400" />{result.type === AnalysisType.BACKTEST ? `Backtest Summary: ${result.backtestStrategy}` : 'Auditor\'s Macro & Market Commentary'}</h3>
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-7">{result.summary}</div>
            </div>
            <StockChart data={result.stocks} type={result.type} />
            <StockList stocks={result.stocks} type={result.type} backtestStrategy={result.backtestStrategy} />
            {result.sources.length > 0 && (<div className="border-t border-slate-800 pt-6"><h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Verified Sources</h4><div className="flex flex-wrap gap-3">{result.sources.map((source, idx) => (<a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-md text-xs text-slate-400 hover:text-white transition-colors"><span className="max-w-[200px] truncate">{source.title}</span><ExternalLink className="w-3 h-3" /></a>))}</div></div>)}
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
