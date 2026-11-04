import React from 'react';
import { formatINR } from '../utils/calculator';
import { X, Printer, Download, CheckCircle, FileText } from 'lucide-react';

export default function ContractNoteModal({ isOpen, onClose, result, buyPrice, sellPrice, quantity, segment, exchange }) {
  if (!isOpen || !result) return null;

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const contractNo = `GRW-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Simulated Electronic Contract Note</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Note Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 font-sans print:p-0">
          {/* Header Info */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="text-emerald-500">GROWW</span>
                <span className="text-xs font-normal text-slate-400">| Nextbillion Technology Pvt Ltd</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                SEBI Reg No: INZ000208032 | CDSL DP ID: 12088700 | NSE Member: 90177
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Contract Note Ref</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{contractNo}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Trade Date: {today}</span>
            </div>
          </div>

          {/* Trade Details */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Trade Summary ({segment.toUpperCase()} - {exchange})</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="text-[10px] text-slate-400 block">Quantity</span>
                <span className="font-mono font-bold">{quantity} shares</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Buy Price</span>
                <span className="font-mono font-bold">{formatINR(buyPrice)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Sell Price</span>
                <span className="font-mono font-bold">{formatINR(sellPrice)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Turnover</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(result.totalTurnover)}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Deductions */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Regulatory & Brokerage Charges</div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">Groww Brokerage Fee</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.brokerage.total)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">Securities Transaction Tax (STT)</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.stt.total)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">Exchange Transaction Charges ({exchange})</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.exchangeTxn.total)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">DP Charges (CDSL + Groww Depository)</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.dpCharges.total)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">Goods and Services Tax (18% GST)</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.gst.total)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">SEBI Turnover Fee</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.sebiCharges.total)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-400">State Stamp Duty</td>
                  <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(result.breakdown.stampDuty.total)}
                  </td>
                </tr>
                <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-800/40">
                  <td className="py-2.5 text-slate-900 dark:text-white pl-1">Total Deductions</td>
                  <td className="py-2.5 text-right font-mono text-amber-600 dark:text-amber-400 text-sm pr-1">
                    {formatINR(result.totalCharges)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Final Settlement */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Net In-Hand P&L
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatINR(result.netPnL)}
              </span>
            </div>
            <div className="text-right text-[11px] text-emerald-700 dark:text-emerald-300">
              Net ROI: <span className="font-bold">{result.netROI >= 0 ? '+' : ''}{result.netROI.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Generated for simulation purposes based on Groww pricing rules</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Note</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
