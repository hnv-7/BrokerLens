import React from 'react';
import { BROKER_LIST } from '../utils/calculator';
import { Settings2 } from 'lucide-react';

export default function BrokerSelector({
  selectedBrokerId,
  onSelectBroker,
  customSettings,
  onUpdateCustomSettings,
}) {
  const activeBroker = BROKER_LIST.find((b) => b.id === selectedBrokerId) || BROKER_LIST[0];
  const isCustom = selectedBrokerId === 'custom';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{isCustom ? '🛠️' : activeBroker.logo}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Active Broker:
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isCustom ? customSettings?.name || 'Custom Broker' : activeBroker.name}
              </span>
              {activeBroker.id === 'groww' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                  Default
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Delivery: <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isCustom
                  ? (Number(customSettings?.deliveryPercent) === 0 && Number(customSettings?.deliveryCap) === 0
                      ? '₹0 Free'
                      : `₹${customSettings?.deliveryCap} / ${customSettings?.deliveryPercent}% cap`)
                  : activeBroker.deliveryText}
              </span> • DP Charge: <span className="font-semibold text-slate-700 dark:text-slate-300">
                ₹{isCustom ? (Number(customSettings?.dpBase) * 1.18).toFixed(2) : activeBroker.dpTotalWithGst.toFixed(2)}/ISIN
              </span>
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 shrink-0 self-start sm:self-auto">
          Switch or Customize Broker 👇
        </span>
      </div>

      {/* Broker Buttons List */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {BROKER_LIST.map((broker) => {
          const isSelected = broker.id === selectedBrokerId;
          return (
            <button
              key={broker.id}
              onClick={() => onSelectBroker(broker.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base shrink-0">{broker.logo}</span>
                <div className="truncate">
                  <div className="text-xs truncate">{broker.name}</div>
                  <div className={`text-[9px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {broker.id === 'zerodha' || broker.id === 'dhan' || broker.id === 'kotak'
                      ? '₹0 Delivery'
                      : broker.id === 'custom'
                      ? 'Custom Rates'
                      : '₹20 Cap'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Broker Rate Configurator Drawer */}
      {isCustom && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-emerald-500" />
              <span>Configure Custom Broker Charges</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">
              Statutory Govt & SEBI taxes will still apply accurately
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Broker Name</label>
              <input
                type="text"
                value={customSettings?.name || ''}
                onChange={(e) => onUpdateCustomSettings({ ...customSettings, name: e.target.value })}
                placeholder="e.g. HDFC Sky, ICICI"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Delivery Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={customSettings?.deliveryPercent ?? ''}
                onChange={(e) => onUpdateCustomSettings({ ...customSettings, deliveryPercent: e.target.value })}
                placeholder="0.05"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Delivery Max Cap (₹)</label>
              <input
                type="number"
                min="0"
                value={customSettings?.deliveryCap ?? ''}
                onChange={(e) => onUpdateCustomSettings({ ...customSettings, deliveryCap: e.target.value })}
                placeholder="20 (0 for free)"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Intraday Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={customSettings?.intradayPercent ?? ''}
                onChange={(e) => onUpdateCustomSettings({ ...customSettings, intradayPercent: e.target.value })}
                placeholder="0.03"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Intraday Max Cap (₹)</label>
              <input
                type="number"
                min="0"
                value={customSettings?.intradayCap ?? ''}
                onChange={(e) => onUpdateCustomSettings({ ...customSettings, intradayCap: e.target.value })}
                placeholder="20"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">DP Base Charge (₹)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={customSettings?.dpBase ?? ''}
                onChange={(e) => onUpdateCustomSettings({ ...customSettings, dpBase: e.target.value })}
                placeholder="13.50"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
