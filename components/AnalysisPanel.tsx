import React from 'react';
import { FortuneResponse } from '../types';
import { ScrollText, TrendingUp, AlertTriangle, Disc } from 'lucide-react';

interface AnalysisPanelProps {
  data: FortuneResponse;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-8">
      
      {/* Bazi Info Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Disc className="w-5 h-5 text-purple-400" /> 基本面数据 (八字)
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-sm font-mono mb-6">
            <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-500 text-xs">年柱</div>
                <div className="text-purple-300 font-bold">{data.bazi.yearPillar}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-500 text-xs">月柱</div>
                <div className="text-purple-300 font-bold">{data.bazi.monthPillar}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-500 text-xs">日柱</div>
                <div className="text-purple-300 font-bold">{data.bazi.dayPillar}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded">
                <div className="text-slate-500 text-xs">时柱</div>
                <div className="text-purple-300 font-bold">{data.bazi.hourPillar}</div>
            </div>
        </div>
        <div className="space-y-3">
             <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">核心要素 (日主)</span>
                <span className="text-slate-200 font-medium">{data.bazi.element}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">生肖</span>
                <span className="text-slate-200 font-medium">{data.bazi.animal}</span>
            </div>
        </div>
      </div>

      {/* Market Highlights */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-400" /> 市场要闻 (人生关键点)
        </h3>
        
        <div className="space-y-4">
             <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <div className="text-red-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> 大牛市 (人生巅峰)
                </div>
                <div className="text-slate-300 text-sm">
                    年龄: {data.bullYears.join(', ')} 岁
                </div>
             </div>

             <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                <div className="text-emerald-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> 熊市风险 (调整期)
                </div>
                <div className="text-slate-300 text-sm">
                     年龄: {data.bearYears.join(', ')} 岁
                </div>
             </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="lg:col-span-3 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
             <ScrollText className="w-5 h-5 text-blue-400" /> 分析师研报
        </h3>
        <div className="prose prose-invert prose-slate max-w-none text-sm leading-relaxed text-slate-300">
             {/* Simple markdown rendering */}
             {data.analysis.split('\n').map((line, i) => (
                 <p key={i} className="mb-2">{line}</p>
             ))}
        </div>
      </div>

    </div>
  );
};

export default AnalysisPanel;