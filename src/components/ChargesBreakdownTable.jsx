import React, { useState } from 'react';
import { formatINR } from '../utils/calculator';
import { HelpCircle, ChevronDown, ChevronUp, FileSpreadsheet, Copy, Check } from 'lucide-react';

export default function ChargesBreakdownTable({ result, exchange, segment }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result || !result.breakdown) return null;

  const { breakdown, buyTurnover, sellTurnover, totalTurnover, totalCharges, broker } = result;
  const brokerName = broker?.name || 'Broker';

  const handleCopySummary = () => {
    const text = `
${brokerName} Brokerage & Charges Summary:
- Buy Turnover: ${formatINR(buyTurnover)}
- Sell Turnover: ${formatINR(sellTurnover)}
- Total Turnover: ${formatINR(totalTurnover)}
--------------------------------
- ${brokerName} Brokerage: ${formatINR(breakdown.brokerage.total)}
- STT / CTT: ${formatINR(breakdown.stt.total)}
- Exchange Txn Charges: ${formatINR(breakdown.exchangeTxn.total)}
- DP Charges (incl GST): ${formatINR(breakdown.dpCharges.total)}
- GST (18%): ${formatINR(breakdown.gst.total)}
- SEBI Charges: ${formatINR(breakdown.sebiCharges.total)}
- Stamp Duty: ${formatINR(breakdown.stampDuty.total)}
- IPFT: ${formatINR(breakdown.ipft.total)}
--------------------------------
Total Taxes & Charges: ${formatINR(totalCharges)}
Gross P&L: ${formatINR(result.grossPnL)}
Net P&L: ${formatINR(result.netPnL)}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    {
      title: 'Brokerage',
      desc: breakdown.brokerage.description,
      buy: breakdown.brokerage.buy,
      sell: breakdown.brokerage.sell,
      total: breakdown.brokerage.total,
      tag: `${brokerName} Fee`,
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      title: 'STT / CTT',
      desc: breakdown.stt.description,
      buy: breakdown.stt.buy,
      sell: breakdown.stt.sell,
      total: breakdown.stt.total,
      tag: 'Govt Tax',
      tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      title: 'Exchange Txn Charge',
      desc: breakdown.exchangeTxn.description,
      buy: breakdown.exchangeTxn.buy,
      sell: breakdown.exchangeTxn.sell,
      total: breakdown.exchangeTxn.total,
      tag: `${exchange} Fee`,
      tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      title: 'DP Charges',
      desc: breakdown.dpCharges.description,
      buy: 0,
      sell: breakdown.dpCharges.total,
      total: breakdown.dpCharges.total,
      tag: 'CDSL / Depository',
      tagColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
    },
    {
      title: 'GST (18%)',
      desc: breakdown.gst.description,
      buy: breakdown.gst.total / 2,
      sell: breakdown.gst.total / 2,
      total: breakdown.gst.total,
      tag: 'Govt Tax',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      title: 'SEBI Charges',
      desc: breakdown.sebiCharges.description,
      buy: breakdown.sebiCharges.buy,
      sell: breakdown.sebiCharges.sell,
      total: breakdown.sebiCharges.total,
      tag: 'Regulator',
      tagColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      title: 'Stamp Duty',
      desc: breakdown.stampDuty.description,
      buy: breakdown.stampDuty.total,
      sell: 0,
      total: breakdown.stampDuty.total,
      tag: 'State Govt',
      tagColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    },
    {
      title: 'IPFT',
      desc: breakdown.ipft.description,
      buy: breakdown.ipft.total / 2,
      sell: breakdown.ipft.total / 2,
      total: breakdown.ipft.total,
      tag: 'Investor Fund',
      tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Itemized Charges Breakdown</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Complete {brokerName} & regulatory statutory deductions
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Turnover summary pills */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 border border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Buy Turnover</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatINR(buyTurnover)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Sell Turnover</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatINR(sellTurnover)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Turnover</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(totalTurnover)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              <th className="pb-3 pl-2">Charge Category</th>
              <th className="pb-3 text-right">Buy Side</th>
              <th className="pb-3 text-right">Sell Side</th>
              <th className="pb-3 text-right pr-2">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row.title} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                <td className="py-2.5 pl-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{row.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${row.tagColor}`}>
                      {row.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{row.desc}</div>
                </td>
                <td className="py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                  {formatINR(row.buy)}
                </td>
                <td className="py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                  {formatINR(row.sell)}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white pr-2">
                  {formatINR(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-bold bg-slate-50/50 dark:bg-slate-800/30">
              <td className="py-3 pl-2 text-slate-900 dark:text-white">
                Total Taxes & {brokerName} Fees
              </td>
              <td className="py-3 text-right font-mono text-slate-500">
                {formatINR(
                  breakdown.brokerage.buy +
                    breakdown.stt.buy +
                    breakdown.exchangeTxn.buy +
                    breakdown.sebiCharges.buy +
                    breakdown.stampDuty.total +
                    breakdown.ipft.total / 2 +
                    breakdown.gst.total / 2
                )}
              </td>
              <td className="py-3 text-right font-mono text-slate-500">
                {formatINR(
                  breakdown.brokerage.sell +
                    breakdown.stt.sell +
                    breakdown.exchangeTxn.sell +
                    breakdown.dpCharges.total +
                    breakdown.sebiCharges.sell +
                    breakdown.ipft.total / 2 +
                    breakdown.gst.total / 2
                )}
              </td>
              <td className="py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm pr-2">
                {formatINR(totalCharges)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Explanatory notes */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
        <div className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{brokerName} Pricing Rules:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-600 dark:text-slate-400 pl-1">
          <li><strong>Delivery Brokerage:</strong> {broker?.deliveryText || 'Standard Delivery Rates'}</li>
          <li><strong>Intraday Brokerage:</strong> {broker?.intradayText || 'Standard Intraday Rates'}</li>
          <li><strong>DP Charges:</strong> ₹{broker?.dpBaseCharge?.toFixed(2) || '13.50'} + 18% GST (₹{broker?.dpTotalWithGst?.toFixed(2) || '15.93'}) per ISIN sold on delivery.</li>
          <li><strong>Stamp Duty:</strong> 0.015% is charged on the BUY value only for Delivery trades.</li>
        </ul>
      </div>
    </div>
  );
}
