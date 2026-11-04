import React from 'react';
import { getBrokerComparison, formatINR } from '../utils/calculator';
import { ShieldCheck, ArrowRight, ExternalLink, Award } from 'lucide-react';

export default function BrokerComparisonTab({ buyPrice, sellPrice, quantity, segment, exchange }) {
  const comparisons = getBrokerComparison({ buyPrice, sellPrice, quantity, segment, exchange });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Broker Charges Comparison</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare total deductions and net profit between Groww, Zerodha, Angel One, and Upstox for this exact trade.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Trade Value: <span className="font-bold text-slate-700 dark:text-slate-200">{formatINR(buyPrice * quantity)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisons.map((c) => {
          const isGroww = c.isCurrent;
          const isProfitable = c.netPnL > 0;

          return (
            <div
              key={c.broker}
              className={`rounded-2xl p-5 border transition-all relative ${
                isGroww
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {isGroww && (
                <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Award className="w-3 h-3" />
                  <span>Current Calculator (Groww)</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.logo}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{c.broker}</h3>
                    <span className="text-[10px] text-slate-400 block">{c.deliveryFeeText}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Brokerage:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatINR(c.brokerage)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Total Taxes & Charges:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {formatINR(c.totalCharges)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Net Take-Home:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatINR(c.netPnL)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Notes */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <div className="font-bold text-slate-900 dark:text-white mb-1">Key Differences Summary:</div>
        <p>• <strong>Groww:</strong> Charges ₹20 or 0.05% (whichever is lower) for Equity Delivery & Intraday trades. DP charge is ₹13.50 + GST (₹15.93).</p>
        <p>• <strong>Zerodha:</strong> Free ₹0 brokerage for Equity Delivery, ₹20/0.03% for Intraday. DP charge is ₹13.50 + GST.</p>
        <p>• <strong>Statutory Taxes (STT, Stamp Duty, GST, Exchange txn, SEBI):</strong> Are mandated by the Government of India / SEBI and are exactly identical across all brokers.</p>
      </div>
    </div>
  );
}
