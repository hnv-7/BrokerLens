import React, { useState } from 'react';
import { SEGMENTS, EXCHANGES, STOCK_PRESETS, formatINR } from '../utils/calculator';
import { Sparkles, SlidersHorizontal, Hash } from 'lucide-react';

export default function CalculatorInput({
  inputMode,
  setInputMode, // 'invested' (Total Values) | 'price' (Per Share)
  investedAmount,
  setInvestedAmount,
  currentTotalValue,
  setCurrentTotalValue,
  buyPrice,
  setBuyPrice,
  sellPrice,
  setSellPrice,
  quantity,
  setQuantity,
  segment,
  setSegment,
  exchange,
  setExchange,
  buyOrdersCount,
  setBuyOrdersCount,
  sellOrdersCount,
  setSellOrdersCount,
  isinCount,
  setIsinCount,
  onApplyPreset,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick Sell Target helpers (sets +X% gain on invested amount)
  const handleQuickTarget = (percent) => {
    const currentInvested = inputMode === 'invested'
      ? investedAmount
      : buyPrice * quantity;

    if (currentInvested > 0) {
      const newTotalValue = Number((currentInvested * (1 + percent / 100)).toFixed(2));
      setCurrentTotalValue(newTotalValue);
      if (quantity > 0) {
        setSellPrice(Number((newTotalValue / quantity).toFixed(2)));
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Segment Selector & Exchange Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        {/* Segment Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: SEGMENTS.DELIVERY, label: 'Delivery (CNC)' },
            { id: SEGMENTS.INTRADAY, label: 'Intraday (MIS)' },
            { id: SEGMENTS.FUTURES, label: 'Futures' },
            { id: SEGMENTS.OPTIONS, label: 'Options' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSegment(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                segment === item.id
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Exchange Selector (NSE / BSE) */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[EXCHANGES.NSE, EXCHANGES.BSE].map((ex) => (
            <button
              key={ex}
              onClick={() => setExchange(ex)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                exchange === ex
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Calculation Input Mode:
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {inputMode === 'invested'
                ? 'Total Invested Amount (₹) & Total Current Value (₹)'
                : 'Per Share Buy Price (₹) & Per Share Sell Price (₹)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setInputMode('invested')}
            className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${
              inputMode === 'invested'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Total Amounts (₹)
          </button>
          <button
            onClick={() => setInputMode('price')}
            className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${
              inputMode === 'price'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Per Share Price (₹)
          </button>
        </div>
      </div>

      {/* Presets Bar */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Quick Example Presets</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STOCK_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => onApplyPreset(p)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Perfectly Aligned Interactive Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* CARD 1: Invested Amount OR Buy Price */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 transition hover:border-slate-300 dark:hover:border-slate-600">
          <div>
            <div className="flex items-center justify-between h-6 mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {inputMode === 'invested' ? 'Total Invested Amount' : 'Buy Price per Share'}
              </label>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                {inputMode === 'invested' ? 'Total' : '/ Share'}
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="font-bold text-xs">₹</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={inputMode === 'invested' ? (investedAmount || '') : (buyPrice || '')}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (inputMode === 'invested') {
                    setInvestedAmount(val);
                    if (quantity > 0) setBuyPrice(Number((val / quantity).toFixed(2)));
                  } else {
                    setBuyPrice(val);
                    setInvestedAmount(Number((val * quantity).toFixed(2)));
                  }
                }}
                placeholder={inputMode === 'invested' ? '142500' : '2850'}
                className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{inputMode === 'invested' ? 'Avg Buy Price:' : 'Total Invested:'}</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              {inputMode === 'invested'
                ? (quantity > 0 ? `${formatINR(investedAmount / quantity)}/sh` : '₹0.00')
                : formatINR(buyPrice * quantity)}
            </span>
          </div>
        </div>

        {/* CARD 2: Total Number of Stocks (Quantity) */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 transition hover:border-slate-300 dark:hover:border-slate-600">
          <div>
            <div className="flex items-center justify-between h-6 mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                Total Number of Stocks
              </label>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                Qty
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-3.5 h-3.5" />
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity || ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuantity(val);
                  if (inputMode === 'invested') {
                    if (val > 0) {
                      setBuyPrice(Number((investedAmount / val).toFixed(2)));
                      setSellPrice(Number((currentTotalValue / val).toFixed(2)));
                    }
                  } else {
                    setInvestedAmount(Number((buyPrice * val).toFixed(2)));
                    setCurrentTotalValue(Number((sellPrice * val).toFixed(2)));
                  }
                }}
                placeholder="50"
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Total Units:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              {quantity} {quantity === 1 ? 'share' : 'shares'}
            </span>
          </div>
        </div>

        {/* CARD 3: Current Total Value OR Current Sell Price */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 transition hover:border-slate-300 dark:hover:border-slate-600">
          <div>
            <div className="flex items-center justify-between h-6 mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {inputMode === 'invested' ? 'Total Current / Sell Value' : 'Current / Sell Price'}
              </label>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                {inputMode === 'invested' ? 'Total' : '/ Share'}
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="font-bold text-xs">₹</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={inputMode === 'invested' ? (currentTotalValue || '') : (sellPrice || '')}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (inputMode === 'invested') {
                    setCurrentTotalValue(val);
                    if (quantity > 0) setSellPrice(Number((val / quantity).toFixed(2)));
                  } else {
                    setSellPrice(val);
                    setCurrentTotalValue(Number((val * quantity).toFixed(2)));
                  }
                }}
                placeholder={inputMode === 'invested' ? '152500' : '3050'}
                className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{inputMode === 'invested' ? 'Avg Sell Price:' : 'Total Selling Value:'}</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              {inputMode === 'invested'
                ? (quantity > 0 ? `${formatINR(currentTotalValue / quantity)}/sh` : '₹0.00')
                : formatINR(sellPrice * quantity)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Sell Target Pills */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick Profit Targets (Set Sell Value / Price):
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: '+2%', val: 2 },
            { label: '+5%', val: 5 },
            { label: '+10%', val: 10 },
            { label: '+20%', val: 20 },
            { label: '+50%', val: 50 },
            { label: '2x (100%)', val: 100 },
            { label: '-5% (SL)', val: -5 },
            { label: '-10%', val: -10 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleQuickTarget(item.val)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                item.val > 0
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:hover:bg-emerald-900/60'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 dark:hover:bg-rose-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Order Settings (Tranches, DP Debits)</span>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs animate-fade-in">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Buy Orders Count</label>
              <input
                type="number"
                min="1"
                max="20"
                value={buyOrdersCount}
                onChange={(e) => setBuyOrdersCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">If bought in multiple chunks</span>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Sell Orders Count</label>
              <input
                type="number"
                min="1"
                max="20"
                value={sellOrdersCount}
                onChange={(e) => setSellOrdersCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">If selling in multiple chunks</span>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Number of Stocks / ISIN Debited</label>
              <input
                type="number"
                min="1"
                max="10"
                value={isinCount}
                onChange={(e) => setIsinCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">₹15.93 DP charge per ISIN on delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
