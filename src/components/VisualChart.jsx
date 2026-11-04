import React, { useState } from 'react';
import { formatINR } from '../utils/calculator';
import { Info, PieChart as PieIcon } from 'lucide-react';

export default function VisualChart({ result }) {
  const [activeSlice, setActiveSlice] = useState(null);

  if (!result || !result.breakdown) return null;

  const { breakdown, grossPnL, netPnL, totalCharges, broker } = result;
  const brokerName = broker?.name || 'Broker';

  const chargeItems = [
    { label: 'Brokerage', value: breakdown.brokerage.total, color: '#00D09C', desc: `${brokerName} fee` },
    { label: 'STT / CTT', value: breakdown.stt.total, color: '#3B82F6', desc: 'Securities Tax' },
    { label: 'Exchange Txn', value: breakdown.exchangeTxn.total, color: '#8B5CF6', desc: 'NSE/BSE charge' },
    { label: 'GST (18%)', value: breakdown.gst.total, color: '#F59E0B', desc: 'Govt GST' },
    { label: 'DP Charges', value: breakdown.dpCharges.total, color: '#EC4899', desc: 'CDSL / Depository' },
    { label: 'Stamp Duty', value: breakdown.stampDuty.total, color: '#14B8A6', desc: 'State Stamp' },
    { label: 'SEBI + IPFT', value: breakdown.sebiCharges.total + breakdown.ipft.total, color: '#64748B', desc: 'Regulatory' },
  ].filter((item) => item.value > 0);

  const totalValue = chargeItems.reduce((acc, curr) => acc + curr.value, 0);

  // SVG Donut calculation
  const size = 200;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Charges & Tax Distribution</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          Total: {formatINR(totalCharges)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {totalValue === 0 ? (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#E2E8F0"
                strokeWidth={22}
              />
            ) : (
              chargeItems.map((slice, idx) => {
                const percentage = slice.value / totalValue;
                const strokeDasharray = `${percentage * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle * circumference;
                accumulatedAngle += percentage;

                const isHovered = activeSlice === idx;

                return (
                  <circle
                    key={slice.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? 26 : 22}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setActiveSlice(idx)}
                    onMouseLeave={() => setActiveSlice(null)}
                  />
                );
              })
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeSlice !== null ? (
              <>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {chargeItems[activeSlice].label}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatINR(chargeItems[activeSlice].value)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {((chargeItems[activeSlice].value / totalValue) * 100).toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Taxes & Fees</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatINR(totalCharges)}</span>
                <span className="text-[10px] text-slate-400">{chargeItems.length} items</span>
              </>
            )}
          </div>
        </div>

        {/* Legend / Breakdown List */}
        <div className="sm:col-span-7 space-y-2">
          {chargeItems.map((item, idx) => {
            const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
            const isHovered = activeSlice === idx;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setActiveSlice(idx)}
                onMouseLeave={() => setActiveSlice(null)}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                  isHovered ? 'bg-slate-100 dark:bg-slate-800 scale-[1.02]' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-white">{formatINR(item.value)}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{pct.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gross vs Net Comparison Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-slate-600 dark:text-slate-400">Profit Breakdown</span>
          <span className="text-slate-500 dark:text-slate-400">
            Fees Impact: <span className="font-bold text-rose-500">{formatINR(totalCharges)}</span>
          </span>
        </div>

        <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${Math.max(10, Math.min(100, (Math.max(0, netPnL) / (Math.max(1, grossPnL) || 1)) * 100))}%` }}
            title={`Net Take-Home: ${formatINR(netPnL)}`}
          />
          <div
            className="bg-amber-500 transition-all duration-300"
            style={{ width: `${Math.max(5, Math.min(100, (totalCharges / (Math.max(1, grossPnL) || 1)) * 100))}%` }}
            title={`Total Fees & Taxes: ${formatINR(totalCharges)}`}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] mt-1.5">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Net Take-Home: {formatINR(netPnL)}
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Charges: {formatINR(totalCharges)}
          </div>
        </div>
      </div>
    </div>
  );
}
