import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CalculatorInput from './components/CalculatorInput';
import PnLSummaryCard from './components/PnLSummaryCard';
import VisualChart from './components/VisualChart';
import ChargesBreakdownTable from './components/ChargesBreakdownTable';
import TargetReverseCalculator from './components/TargetReverseCalculator';
import BrokerComparisonTab from './components/BrokerComparisonTab';
import MultiStockPortfolio from './components/MultiStockPortfolio';
import ContractNoteModal from './components/ContractNoteModal';
import PricingFAQ from './components/PricingFAQ';
import { calculateCharges, SEGMENTS, EXCHANGES, formatINR } from './utils/calculator';
import { FileText, Share2, Check, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brokerlens_theme');
      if (saved !== null) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Core Calculator Inputs
  const [inputMode, setInputMode] = useState('invested'); // 'invested' (Total amounts) | 'price' (Per share)
  const [investedAmount, setInvestedAmount] = useState(3851); // ₹3,851 total invested
  const [quantity, setQuantity] = useState(4); // 4 shares
  const [currentTotalValue, setCurrentTotalValue] = useState(4268); // ₹4,268 total current value
  const [buyPrice, setBuyPrice] = useState(962.75); // ₹962.75/share
  const [sellPrice, setSellPrice] = useState(1067.00); // ₹1067.00/share
  const [segment, setSegment] = useState(SEGMENTS.DELIVERY);
  const [exchange, setExchange] = useState(EXCHANGES.NSE);
  const [buyOrdersCount, setBuyOrdersCount] = useState(1);
  const [sellOrdersCount, setSellOrdersCount] = useState(1);
  const [isinCount, setIsinCount] = useState(1);

  // Contract Note Modal
  const [isContractNoteOpen, setIsContractNoteOpen] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Sync dark mode class on <html> & persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('brokerlens_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('brokerlens_theme', 'light');
    }
  }, [darkMode]);

  // Handle Preset Selection
  const handleApplyPreset = (p) => {
    setBuyPrice(p.buyPrice);
    setSellPrice(p.sellPrice);
    setQuantity(p.qty);
    setInvestedAmount(p.buyPrice * p.qty);
    setCurrentTotalValue(p.sellPrice * p.qty);
    setSegment(p.segment);
    setExchange(p.exchange);
  };

  const handleReset = () => {
    setInputMode('invested');
    setInvestedAmount(3851);
    setQuantity(4);
    setCurrentTotalValue(4268);
    setBuyPrice(962.75);
    setSellPrice(1067.00);
    setSegment(SEGMENTS.DELIVERY);
    setExchange(EXCHANGES.NSE);
    setBuyOrdersCount(1);
    setSellOrdersCount(1);
    setIsinCount(1);
  };

  // Derive active buy & sell prices
  const effectiveBuyPrice = inputMode === 'invested' && quantity > 0
    ? investedAmount / quantity
    : buyPrice;

  const effectiveSellPrice = inputMode === 'invested' && quantity > 0
    ? currentTotalValue / quantity
    : sellPrice;

  // Run calculation engine
  const calculationResult = calculateCharges({
    buyPrice: effectiveBuyPrice,
    sellPrice: effectiveSellPrice,
    quantity,
    segment,
    exchange,
    buyOrdersCount,
    sellOrdersCount,
    isinCount,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner with BrokerLens & Groww Charges Overview */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 backdrop-blur-xs text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  BrokerLens • Groww Pricing Engine
                </span>
                <span className="text-xs text-emerald-100">
                  ₹20 or 0.05% Delivery & Intraday Brokerage
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Stock Brokerage, Fees & True Net P&L Calculator
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50/90 mt-1 max-w-2xl">
                See beyond gross profit. Calculate all deductions — Groww brokerage, STT, DP charges, GST & exchange fees — to reveal your exact take-home returns.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsContractNoteOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl text-xs shadow-sm transition"
              >
                <FileText className="w-4 h-4" />
                <span>View Contract Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Single Trade Calculator */}
        {activeTab === 'single' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Inputs */}
              <div className="lg:col-span-6 space-y-6">
                <CalculatorInput
                  inputMode={inputMode}
                  setInputMode={setInputMode}
                  investedAmount={investedAmount}
                  setInvestedAmount={setInvestedAmount}
                  currentTotalValue={currentTotalValue}
                  setCurrentTotalValue={setCurrentTotalValue}
                  buyPrice={effectiveBuyPrice}
                  setBuyPrice={setBuyPrice}
                  sellPrice={effectiveSellPrice}
                  setSellPrice={setSellPrice}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  segment={segment}
                  setSegment={setSegment}
                  exchange={exchange}
                  setExchange={setExchange}
                  buyOrdersCount={buyOrdersCount}
                  setBuyOrdersCount={setBuyOrdersCount}
                  sellOrdersCount={sellOrdersCount}
                  setSellOrdersCount={setSellOrdersCount}
                  isinCount={isinCount}
                  setIsinCount={setIsinCount}
                  onApplyPreset={handleApplyPreset}
                />

                <VisualChart result={calculationResult} />
              </div>

              {/* Right Column: P&L Summary & Itemized Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <PnLSummaryCard
                  result={calculationResult}
                  buyPrice={effectiveBuyPrice}
                  sellPrice={effectiveSellPrice}
                  quantity={quantity}
                  segment={segment}
                />

                <ChargesBreakdownTable
                  result={calculationResult}
                  exchange={exchange}
                  segment={segment}
                />
              </div>
            </div>

            {/* Educational FAQ Guide */}
            <PricingFAQ />
          </div>
        )}

        {/* Tab 2: Target / Reverse Calculator */}
        {activeTab === 'target' && (
          <div className="animate-fade-in space-y-6">
            <TargetReverseCalculator
              buyPrice={effectiveBuyPrice}
              quantity={quantity}
              segment={segment}
              exchange={exchange}
            />
            <PricingFAQ />
          </div>
        )}

        {/* Tab 3: Multi-Stock Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="animate-fade-in space-y-6">
            <MultiStockPortfolio />
            <PricingFAQ />
          </div>
        )}

        {/* Tab 4: Broker Comparison */}
        {activeTab === 'compare' && (
          <div className="animate-fade-in space-y-6">
            <BrokerComparisonTab
              buyPrice={effectiveBuyPrice}
              sellPrice={effectiveSellPrice}
              quantity={quantity}
              segment={segment}
              exchange={exchange}
            />
            <PricingFAQ />
          </div>
        )}
      </main>

      {/* Contract Note Modal */}
      <ContractNoteModal
        isOpen={isContractNoteOpen}
        onClose={() => setIsContractNoteOpen(false)}
        result={calculationResult}
        buyPrice={effectiveBuyPrice}
        sellPrice={effectiveSellPrice}
        quantity={quantity}
        segment={segment}
        exchange={exchange}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">BrokerLens</span> — Accurate Groww Pricing & Statutory Indian Stock Market Tax Rules (STT, Stamp Duty, GST, DP & SEBI Charges).
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://groww.in/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Groww Pricing Structure
            </a>
            <span>•</span>
            <a
              href="https://zerodha.com/brokerage-calculator/#tab-equities"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:underline"
            >
              Zerodha Reference
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
