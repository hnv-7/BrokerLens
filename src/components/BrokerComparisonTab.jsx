import React from 'react';
import { getBrokerComparison, formatINR } from '../utils/calculator';
import { CheckCircle2 } from 'lucide-react';

export default function BrokerComparisonTab({ buyPrice, sellPrice, quantity, segment, exchange, selectedBrokerId, onSelectBroker }) {
  const comparisons = getBrokerComparison({
    buyPrice,
    sellPrice,
    quantity,
    segment,
    exchange,
    selectedBrokerId,
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Broker Charges Comparison</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare total deductions, DP charges, and net take-home profit across India's top discount brokers for this exact trade.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Trade Value: <span className="font-bold text-slate-700 dark:text-slate-200">{formatINR(buyPrice * quantity)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map((c) => {
          const isSelected = c.isCurrent;
          const isProfitable = c.netPnL > 0;

          return (
            <div
              key={c.broker}
              onClick={() => onSelectBroker && onSelectBroker(c.brokerId)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Currently Active</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-3 mt-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{c.logo}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{c.broker}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{c.deliveryFeeText}</span>
                  </div>
                </div>

                {!isSelected && (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md">
                    Select
                  </span>
                )}
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Brokerage:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatINR(c.brokerage)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                  <span>Total Taxes & Fees:</span>
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
        <div className="font-bold text-slate-900 dark:text-white mb-1">Key Takeaway:</div>
        <p>• <strong>Groww & Upstox:</strong> Charge up to ₹20 per trade for Delivery & Intraday.</p>
        <p>• <strong>Zerodha & Dhan:</strong> Offer ₹0 brokerage on Equity Delivery, and charge ₹20/0.03% on Intraday.</p>
        <p>• <strong>DP Charges:</strong> Differ per broker (Dhan: ₹14.75, Kotak: ₹15.34, Groww & Zerodha: ₹15.93, Upstox: ₹21.83, Angel One: ₹23.60).</p>
        <p>• <strong>Statutory Taxes (STT, Stamp Duty, GST, Exchange txn, SEBI):</strong> Are mandated by the Government of India / SEBI and are identical across all brokers.</p>
      </div>
    </div>
  );
}
