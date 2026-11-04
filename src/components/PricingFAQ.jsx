import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';
import { BROKER_LIST } from '../utils/calculator';

export default function PricingFAQ({ selectedBrokerId = 'groww' }) {
  const [openIdx, setOpenIdx] = useState(0);

  const activeBroker = BROKER_LIST.find((b) => b.id === selectedBrokerId) || BROKER_LIST[0];

  const faqs = [
    {
      q: `How does ${activeBroker.name} calculate brokerage?`,
      a: `For Equity Delivery, ${activeBroker.name} charges ${activeBroker.deliveryText}. For Equity Intraday, it charges ${activeBroker.intradayText}. For Futures & Options, it charges ${activeBroker.foText}.`,
    },
    {
      q: `What are DP (Depository Participant) Charges on ${activeBroker.name}?`,
      a: `For ${activeBroker.name}, DP charge is ₹${activeBroker.dpBaseCharge.toFixed(2)} + 18% GST (total ₹${activeBroker.dpTotalWithGst.toFixed(2)}) levied whenever you SELL shares from your Demat account (Delivery trades). This charge is applied per company (ISIN) debited per day, regardless of whether you sold 1 share or 10,000 shares of that company. DP charges are NOT applicable on Intraday or F&O trades.`,
    },
    {
      q: 'How is STT (Securities Transaction Tax) calculated?',
      a: 'STT is a mandatory tax levied by the Government of India. For Equity Delivery, STT is 0.1% on both the Buy value and Sell value. For Equity Intraday, STT is 0.025% on the Sell value only. For Futures, it is 0.02% on Sell value; for Options, it is 0.125% on Sell premium.',
    },
    {
      q: 'What is Stamp Duty in Indian stock trading?',
      a: 'Stamp duty is charged by the State Government under the Indian Stamp Act on the BUY side only. For Delivery trades, it is 0.015% (₹1500 per crore). For Intraday, it is 0.003% (₹300 per crore).',
    },
    {
      q: 'How is GST calculated on stock trades?',
      a: 'GST is charged at 18% on the taxable services provided, which includes Brokerage + Exchange Transaction Charges + SEBI Turnover Charges + Base DP Charges. Note: GST is NOT charged on STT or Stamp Duty.',
    },
    {
      q: 'What is the Breakeven price in BrokerLens?',
      a: `Breakeven price is the exact price per share you must sell at so that your Net P&L is exactly ₹0.00 after paying all ${activeBroker.name} brokerage fees, STT, Exchange transaction charges, GST, SEBI charges, Stamp duty, and DP charges.`,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeBroker.name} & Statutory Taxes Explained (FAQ)</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Indian Stock Market Rules
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-3">
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pr-4 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
