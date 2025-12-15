import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ReferenceLine,
  Cell
} from 'recharts';
import { CandleData } from '../types';

interface StockChartProps {
  data: CandleData[];
  bullYears: number[];
  bearYears: number[];
}

const CustomCandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;
  
  // Chinese Market Colors: Red = Up (Good), Green = Down (Bad)
  const isUp = close >= open;
  const color = isUp ? '#ef4444' : '#10b981'; // Tailwind red-500 : emerald-500
  
  const pixelHeight = height;
  const valueRange = high - low;
  const pixelsPerUnit = valueRange === 0 ? 0 : pixelHeight / valueRange;
  
  const openOffset = (high - open) * pixelsPerUnit;
  const closeOffset = (high - close) * pixelsPerUnit;
  
  const bodyTop = Math.min(openOffset, closeOffset);
  const bodyHeight = Math.abs(openOffset - closeOffset);
  // Ensure min body height for visibility
  const visualBodyHeight = Math.max(bodyHeight, 2); 
  
  const wickX = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line 
        x1={wickX} 
        y1={y} 
        x2={wickX} 
        y2={y + height} 
        stroke={color} 
        strokeWidth={1.5} 
      />
      {/* Body */}
      <rect 
        x={x + 2} // Add padding
        y={y + bodyTop} 
        width={Math.max(width - 4, 1)} 
        height={visualBodyHeight} 
        fill={color} 
        stroke="none"
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isBull = data.close >= data.open;
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded shadow-xl text-xs z-50">
        <p className="font-bold text-slate-200 mb-2">{data.age}岁 ({data.year}年)</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400">
            <span>开盘:</span> <span className="text-right text-slate-200">{data.open}</span>
            <span>收盘:</span> <span className={`text-right ${isBull ? 'text-red-400' : 'text-emerald-400'}`}>{data.close}</span>
            <span>最高:</span> <span className="text-right text-slate-200">{data.high}</span>
            <span>最低:</span> <span className="text-right text-slate-200">{data.low}</span>
            <span>MA5:</span> <span className="text-right text-yellow-400">{data.ma5}</span>
            <span>MA10:</span> <span className="text-right text-blue-400">{data.ma10}</span>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-700">
            <p className="text-slate-300 italic">"{data.summary}"</p>
        </div>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, bullYears, bearYears }) => {
  return (
    <div className="w-full h-[500px] bg-slate-900/50 rounded-xl p-4 border border-slate-800 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> MA5 (短期动能)
            </div>
            <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span> MA10 (大运趋势)
            </div>
            <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-sm"></span> 牛市 (吉)
            </div>
            <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> 熊市 (凶)
            </div>
        </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 40, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="age" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            label={{ value: '年龄', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#94a3b8" 
            tick={{fontSize: 12}}
            label={{ value: '运势指数', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Moving Averages */}
          <Line type="monotone" dataKey="ma5" stroke="#eab308" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="ma10" stroke="#3b82f6" dot={false} strokeWidth={2} />

          {/* Candlesticks - Represented as a Bar with custom shape. 
              We pass [low, high] as the value to define the vertical space. */}
          <Bar 
            dataKey={(d) => [d.low, d.high]} 
            shape={<CustomCandleShape />} 
            isAnimationActive={true}
          >
          </Bar>

           {/* Reference Lines for Key Pivot Points */}
           {bullYears.map(age => (
               <ReferenceLine key={`bull-${age}`} x={age} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '★', fill: '#ef4444', fontSize: 20 }} />
           ))}
             {bearYears.map(age => (
               <ReferenceLine key={`bear-${age}`} x={age} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'bottom', value: '⚠', fill: '#10b981', fontSize: 20 }} />
           ))}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;