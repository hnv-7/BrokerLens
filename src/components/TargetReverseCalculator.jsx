import React, { useState } from 'react';
import { calculateCharges, formatINR, BROKERS, SEGMENTS, EXCHANGES } from '../utils/calculator';
import { Target, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function TargetReverseCalculator({ buyPrice, quantity, segment, exchange, selectedBrokerId = 'groww' }) {
  const [targetNetProfit, setTargetNetProfit] = useState(5000);

  const activeBroker = BROKERS[selectedBrokerId?.toUpperCase()] || BROKERS.GROWW;

  // Iterative binary search to find exact Sell Price that yields targetNetProfit after all taxes
  const findRequiredSellPrice = (desiredNet) => {
    if (!buyPrice || !quantity) return 0;

    let low = buyPrice;
    let high = buyPrice * 5 + 1000;
    let requiredSell = buyPrice;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const res = calculateCharges({ buyPrice, sellPrice: mid, quantity, segment, exchange, brokerId: selectedBrokerId });

      if (res.netPnL < desiredNet) {
        low = mid;
      } else {
        high = mid;
        requiredSell = mid;
      }
    }

    return Number(requiredSell.toFixed(2));
  };

  const requiredSellPrice = findRequiredSellPrice(targetNetProfit);
  const simulation = calculateCharges({ buyPrice, sellPrice: requiredSellPrice, quantity, segment, exchange, brokerId: selectedBrokerId });
  const pointsGainNeeded = requiredSellPrice - buyPrice;
  const percentageGainNeeded = buyPrice > 0 ? (pointsGainNeeded / buyPrice) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reverse Target Calculator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find the exact target selling price needed to achieve your desired net profit after all {activeBroker.name} fees and taxes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Desired Net Profit (₹ Take-Home)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={targetNetProfit || ''}
                onChange={(e) => setTargetNetProfit(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-base focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Quick Target Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[1000, 2500, 5000, 10000, 25000, 50000].map((amt) => (
              <button
                key={amt}
                onClick={() => setTargetNetProfit(amt)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  targetNetProfit === amt
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Active Broker:</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span>{activeBroker.logo}</span>
                <span>{activeBroker.name}</span>
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Your Buy Price:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{formatINR(buyPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Quantity:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{quantity} shares</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Invested Capital:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{formatINR(buyPrice * quantity)}</span>
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-indigo-500/10 dark:bg-purple-950/20 p-6 rounded-2xl border border-purple-500/20 space-y-4">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>Required Selling Price</span>
          </div>

          <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            {formatINR(requiredSellPrice)}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-semibold">
              +{percentageGainNeeded.toFixed(2)}% Stock Gain
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              (+₹{pointsGainNeeded.toFixed(2)} per share)
            </span>
          </div>

          <div className="pt-3 border-t border-purple-200/50 dark:border-purple-900/40 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Gross Profit Generated:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {formatINR(simulation.grossPnL)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Taxes & {activeBroker.name} Fees:</span>
              <span className="font-bold text-rose-500 font-mono">
                -{formatINR(simulation.totalCharges)}
              </span>
            </div>
            <div className="flex justify-between text-slate-900 dark:text-white font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
              <span>Final Net In-Hand Profit:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                {formatINR(simulation.netPnL)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
