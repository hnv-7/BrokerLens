import React, { useEffect } from 'react';
import { formatINR } from '../utils/calculator';
import { TrendingUp, TrendingDown, ShieldAlert, Award, ArrowUpRight, ArrowDownRight, Zap, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PnLSummaryCard({ result, buyPrice, sellPrice, quantity, segment }) {
  if (!result) return null;

  const {
    grossPnL,
    grossROI,
    netPnL,
    netROI,
    totalCharges,
    pointsToBreakeven,
    breakevenPrice,
    chargePercentageOfProfit,
    buyTurnover,
    sellTurnover,
    broker,
  } = result;

  const brokerName = broker?.name || 'broker';
  const isProfit = netPnL > 0;
  const isBreakEven = Math.abs(netPnL) < 1;
  const isLoss = netPnL < 0 && !isBreakEven;

  // Trigger light confetti if substantial profit
  useEffect(() => {
    if (netPnL > 500 && Math.random() < 0.3) {
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#00D09C', '#3B82F6', '#10B981'],
        });
      } catch (e) {
        // ignore in non-browser env
      }
    }
  }, [netPnL]);

  return (
    <div className="space-y-4">
      {/* Main Net P&L Card */}
      <div
        className={`rounded-2xl p-6 border shadow-sm transition-all relative overflow-hidden ${
          isProfit
            ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border-emerald-500/30 dark:bg-emerald-950/20'
            : isLoss
            ? 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-orange-500/10 border-rose-500/30 dark:bg-rose-950/20'
            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Net Take-Home P&L
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isProfit
                    ? 'bg-emerald-500 text-white'
                    : isLoss
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                {isProfit ? (
                  <>
                    <ArrowUpRight className="w-3 h-3" />
                    <span>PROFIT (+{netROI.toFixed(2)}%)</span>
                  </>
                ) : isLoss ? (
                  <>
                    <ArrowDownRight className="w-3 h-3" />
                    <span>LOSS ({netROI.toFixed(2)}%)</span>
                  </>
                ) : (
                  <span>BREAKEVEN</span>
                )}
              </span>
            </div>

            <div
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isProfit
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isLoss
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatINR(netPnL)}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Actual amount credited / debited after all {brokerName} fees, STT, Exchange, GST & DP charges.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Gross Profit</span>
              <span
                className={`text-sm font-bold ${
                  grossPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatINR(grossPnL)} ({grossROI >= 0 ? '+' : ''}
                {grossROI.toFixed(2)}%)
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Charges</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {formatINR(totalCharges)}
              </span>
            </div>
          </div>
        </div>

        {/* Breakeven Banner */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Breakeven Sell Price:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {formatINR(breakevenPrice)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span>Points to Breakeven:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              +₹{pointsToBreakeven.toFixed(2)} / share
            </span>
          </div>
        </div>
      </div>

      {/* 3 Key Breakdown Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Invested Amount</span>
            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Buy
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
            {formatINR(buyTurnover)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {quantity} shares @ {formatINR(buyPrice)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Current / Sell Value</span>
            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Sell
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
            {formatINR(sellTurnover)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {quantity} shares @ {formatINR(sellPrice)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Effective Tax Impact</span>
            <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded">
              Fees
            </span>
          </div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
            {formatINR(totalCharges)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {grossPnL > 0
              ? `${chargePercentageOfProfit.toFixed(1)}% of gross gains eaten by fees`
              : `${((totalCharges / (buyTurnover || 1)) * 100).toFixed(2)}% of capital`}
          </div>
        </div>
      </div>
    </div>
  );
}
