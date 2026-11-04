import React, { useState } from 'react';
import { calculateCharges, formatINR, BROKER_LIST, SEGMENTS, EXCHANGES } from '../utils/calculator';
import { Plus, Trash2, Layers, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles } from 'lucide-react';

export default function MultiStockPortfolio({ selectedBrokerId = 'groww' }) {
  const [stocks, setStocks] = useState([
    { id: 1, name: 'Reliance Industries', buyPrice: 2850, sellPrice: 3050, qty: 50, segment: SEGMENTS.DELIVERY, exchange: EXCHANGES.NSE, brokerId: selectedBrokerId },
    { id: 2, name: 'Tata Motors', buyPrice: 880, sellPrice: 960, qty: 100, segment: SEGMENTS.DELIVERY, exchange: EXCHANGES.NSE, brokerId: selectedBrokerId },
    { id: 3, name: 'Zomato', buyPrice: 210, sellPrice: 250, qty: 400, segment: SEGMENTS.DELIVERY, exchange: EXCHANGES.NSE, brokerId: selectedBrokerId },
  ]);

  const [newStock, setNewStock] = useState({
    name: '',
    buyPrice: '',
    sellPrice: '',
    qty: '',
    segment: SEGMENTS.DELIVERY,
    exchange: EXCHANGES.NSE,
    brokerId: selectedBrokerId,
  });

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!newStock.name || !newStock.buyPrice || !newStock.sellPrice || !newStock.qty) return;

    setStocks([
      ...stocks,
      {
        id: Date.now(),
        name: newStock.name,
        buyPrice: Number(newStock.buyPrice),
        sellPrice: Number(newStock.sellPrice),
        qty: Number(newStock.qty),
        segment: newStock.segment,
        exchange: newStock.exchange,
        brokerId: newStock.brokerId || selectedBrokerId,
      },
    ]);

    setNewStock({
      name: '',
      buyPrice: '',
      sellPrice: '',
      qty: '',
      segment: SEGMENTS.DELIVERY,
      exchange: EXCHANGES.NSE,
      brokerId: selectedBrokerId,
    });
  };

  const handleRemoveStock = (id) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  // Compute individual and combined results
  const stockResults = stocks.map((s) => ({
    ...s,
    calc: calculateCharges({
      buyPrice: s.buyPrice,
      sellPrice: s.sellPrice,
      quantity: s.qty,
      segment: s.segment,
      exchange: s.exchange,
      brokerId: s.brokerId || selectedBrokerId,
    }),
  }));

  const totalInvested = stockResults.reduce((acc, s) => acc + s.calc.buyTurnover, 0);
  const totalCurrentValue = stockResults.reduce((acc, s) => acc + s.calc.sellTurnover, 0);
  const totalGrossPnL = stockResults.reduce((acc, s) => acc + s.calc.grossPnL, 0);
  const totalCharges = stockResults.reduce((acc, s) => acc + s.calc.totalCharges, 0);
  const totalNetPnL = stockResults.reduce((acc, s) => acc + s.calc.netPnL, 0);
  const totalROI = totalInvested > 0 ? (totalNetPnL / totalInvested) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multi-Stock Portfolio Calculator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate combined brokerage, DP debits, statutory taxes, and net profit across multiple stocks.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Combined Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Invested</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">{formatINR(totalInvested)}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">{stocks.length} positions</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Current Value</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">{formatINR(totalCurrentValue)}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Sell turnover</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Charges & Taxes</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">{formatINR(totalCharges)}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">All fees combined</span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            totalNetPnL >= 0
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/30'
          }`}
        >
          <span className="text-xs text-slate-400 font-semibold block mb-1">Portfolio Net P&L</span>
          <span
            className={`text-xl font-bold font-mono ${
              totalNetPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatINR(totalNetPnL)}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mt-0.5">
            {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}% Net Return
          </span>
        </div>
      </div>

      {/* Stock Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3 pl-2">Stock / Position</th>
              <th className="pb-3 text-right">Qty</th>
              <th className="pb-3 text-right">Buy Price</th>
              <th className="pb-3 text-right">Sell Price</th>
              <th className="pb-3 text-right">Gross P&L</th>
              <th className="pb-3 text-right">Total Fees</th>
              <th className="pb-3 text-right">Net P&L</th>
              <th className="pb-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {stockResults.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white">
                  {s.name}
                  <span className="text-[10px] block font-normal text-slate-400">{s.calc.broker.name} • {s.segment.toUpperCase()} • {s.exchange}</span>
                </td>
                <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300">{s.qty}</td>
                <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatINR(s.buyPrice)}</td>
                <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatINR(s.sellPrice)}</td>
                <td className={`py-3 text-right font-mono font-semibold ${s.calc.grossPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatINR(s.calc.grossPnL)}
                </td>
                <td className="py-3 text-right font-mono text-amber-600 dark:text-amber-400">{formatINR(s.calc.totalCharges)}</td>
                <td className={`py-3 text-right font-mono font-bold ${s.calc.netPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatINR(s.calc.netPnL)}
                </td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => handleRemoveStock(s.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Stock Form */}
      <form onSubmit={handleAddStock} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-500" />
          <span>Add Position to Portfolio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Stock Name (e.g. Infosys)"
            value={newStock.name}
            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            required
          />
          <select
            value={newStock.brokerId}
            onChange={(e) => setNewStock({ ...newStock, brokerId: e.target.value })}
            className="px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
          >
            {BROKER_LIST.map((b) => (
              <option key={b.id} value={b.id}>
                {b.logo} {b.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Buy Price (₹)"
            min="0"
            step="any"
            value={newStock.buyPrice}
            onChange={(e) => setNewStock({ ...newStock, buyPrice: e.target.value })}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
            required
          />
          <input
            type="number"
            placeholder="Sell Price (₹)"
            min="0"
            step="any"
            value={newStock.sellPrice}
            onChange={(e) => setNewStock({ ...newStock, sellPrice: e.target.value })}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
            required
          />
          <input
            type="number"
            placeholder="Qty"
            min="1"
            value={newStock.qty}
            onChange={(e) => setNewStock({ ...newStock, qty: e.target.value })}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock</span>
          </button>
        </div>
      </form>
    </div>
  );
}
