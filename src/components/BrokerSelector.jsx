import React from 'react';
import { BROKER_LIST } from '../utils/calculator';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function BrokerSelector({ selectedBrokerId, onSelectBroker }) {
  const activeBroker = BROKER_LIST.find((b) => b.id === selectedBrokerId) || BROKER_LIST[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{activeBroker.logo}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Active Broker:
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {activeBroker.name}
              </span>
              {activeBroker.id === 'groww' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                  Default
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Delivery: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeBroker.deliveryText}</span> • DP Charge: <span className="font-semibold text-slate-700 dark:text-slate-300">₹{activeBroker.dpTotalWithGst.toFixed(2)}/ISIN</span>
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 shrink-0 self-start sm:self-auto">
          Switch Broker below 👇
        </span>
      </div>

      {/* Broker Buttons List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {BROKER_LIST.map((broker) => {
          const isSelected = broker.id === selectedBrokerId;
          return (
            <button
              key={broker.id}
              onClick={() => onSelectBroker(broker.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-lg shrink-0">{broker.logo}</span>
                <div className="truncate">
                  <div className="text-xs truncate">{broker.name}</div>
                  <div className={`text-[9px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {broker.id === 'zerodha' || broker.id === 'dhan' || broker.id === 'kotak' ? '₹0 Delivery' : '₹20 Cap'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
