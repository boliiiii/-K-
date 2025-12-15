import React, { useState } from 'react';
import InputForm from './components/InputForm';
import StockChart from './components/StockChart';
import AnalysisPanel from './components/AnalysisPanel';
import { generateFortuneData } from './services/geminiService';
import { UserInput, FortuneResponse } from './types';
import { LineChart } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<FortuneResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await generateFortuneData(input);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-200 p-4 md:p-8 overflow-x-hidden">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-purple-600 p-2 rounded-lg shadow-lg">
            <LineChart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
              命运 <span className="text-red-500">K线图</span>
            </h1>
            <p className="text-slate-500 text-sm hidden md:block">
              将您的人生运势可视化为金融资产走势
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
             <div className="text-xs font-mono text-slate-500">市场状态</div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-slate-300">实盘交易中</span>
             </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        
        {!data && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
              <InputForm onSubmit={handleInputSubmit} isLoading={loading} />
              
              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm max-w-md text-center">
                  错误: {error}
                </div>
              )}
           </div>
        )}

        {loading && !data && (
            <div className="fixed inset-0 bg-slate-900/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-red-600 animate-market-load"></div>
                </div>
                <p className="mt-4 text-slate-400 font-mono animate-pulse">正在解析天干地支数据...</p>
                <style>{`
                    @keyframes market-load {
                        0% { width: 0%; left: 0; }
                        50% { width: 50%; left: 25%; }
                        100% { width: 100%; left: 0; }
                    }
                    .animate-market-load {
                        animation: market-load 2s infinite ease-in-out;
                    }
                `}</style>
            </div>
        )}

        {data && (
          <div className="w-full animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-slate-100 border-l-4 border-red-500 pl-4">
                    人生走势 (0 - 80岁)
                 </h2>
                 <button 
                    onClick={() => setData(null)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                 >
                    ← 分析另一位
                 </button>
            </div>

            <StockChart 
                data={data.chartData} 
                bullYears={data.bullYears} 
                bearYears={data.bearYears} 
            />

            <AnalysisPanel data={data} />
            
            <footer className="mt-12 text-center text-slate-600 text-xs border-t border-slate-800 pt-8">
                <p>免责声明：本模拟仅供娱乐，基于八字命理学和AI生成。非专业金融或人生建议。</p>
                <p className="mt-2">Powered by Google Gemini 2.5 Flash</p>
            </footer>
          </div>
        )}

      </main>
      
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;