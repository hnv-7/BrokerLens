/**
 * BrokerLens Universal Stock Brokerage & Charges Calculation Engine
 * Supports Groww (Default), Zerodha, Angel One, Upstox, Dhan, Kotak Neo, and Custom Broker.
 */

export const BROKERS = {
  GROWW: {
    id: 'groww',
    name: 'Groww',
    logo: '🌱',
    themeColor: 'emerald',
    deliveryText: '₹20 or 0.05% (whichever is lower)',
    intradayText: '₹20 or 0.05% (whichever is lower)',
    foText: 'Flat ₹20 / order',
    dpBaseCharge: 13.5, // ₹13.50 + 18% GST = ₹15.93
    dpTotalWithGst: 15.93,
    deliveryRate: 0.0005, // 0.05%
    deliveryMaxCap: 20,
    intradayRate: 0.0005, // 0.05%
    intradayMaxCap: 20,
    foRate: 20,
    sebiRegNo: 'INZ000208032',
    entityName: 'Nextbillion Technology Pvt Ltd',
  },
  ZERODHA: {
    id: 'zerodha',
    name: 'Zerodha',
    logo: '🪁',
    themeColor: 'blue',
    deliveryText: '₹0 (Free Equity Delivery)',
    intradayText: '₹20 or 0.03% (whichever is lower)',
    foText: 'Flat ₹20 / order',
    dpBaseCharge: 13.5, // ₹13.50 + 18% GST = ₹15.93
    dpTotalWithGst: 15.93,
    deliveryRate: 0,
    deliveryMaxCap: 0,
    intradayRate: 0.0003, // 0.03%
    intradayMaxCap: 20,
    foRate: 20,
    sebiRegNo: 'INZ000031633',
    entityName: 'Zerodha Broking Ltd',
  },
  ANGEL_ONE: {
    id: 'angelone',
    name: 'Angel One',
    logo: '👼',
    themeColor: 'red',
    deliveryText: '₹20 or 0.1% (whichever is lower)',
    intradayText: '₹20 or 0.25% (whichever is lower)',
    foText: 'Flat ₹20 / order',
    dpBaseCharge: 20.0, // ₹20 + 18% GST = ₹23.60
    dpTotalWithGst: 23.6,
    deliveryRate: 0.001, // 0.1%
    deliveryMaxCap: 20,
    intradayRate: 0.0025, // 0.25%
    intradayMaxCap: 20,
    foRate: 20,
    sebiRegNo: 'INZ000161534',
    entityName: 'Angel One Limited',
  },
  UPSTOX: {
    id: 'upstox',
    name: 'Upstox',
    logo: '🚀',
    themeColor: 'purple',
    deliveryText: '₹20 or 2.5% (whichever is lower, max ₹20)',
    intradayText: '₹20 or 0.05% (whichever is lower)',
    foText: 'Flat ₹20 / order',
    dpBaseCharge: 18.5, // ₹18.50 + 18% GST = ₹21.83
    dpTotalWithGst: 21.83,
    deliveryRate: 0.025,
    deliveryMaxCap: 20,
    intradayRate: 0.0005,
    intradayMaxCap: 20,
    foRate: 20,
    sebiRegNo: 'INZ000015837',
    entityName: 'RKSV Securities India Pvt Ltd',
  },
  DHAN: {
    id: 'dhan',
    name: 'Dhan',
    logo: '⚡',
    themeColor: 'amber',
    deliveryText: '₹0 (Free Equity Delivery)',
    intradayText: '₹20 or 0.03% (whichever is lower)',
    foText: 'Flat ₹20 / order',
    dpBaseCharge: 12.5, // ₹12.50 + 18% GST = ₹14.75
    dpTotalWithGst: 14.75,
    deliveryRate: 0,
    deliveryMaxCap: 0,
    intradayRate: 0.0003,
    intradayMaxCap: 20,
    foRate: 20,
    sebiRegNo: 'INZ000006031',
    entityName: 'Moneylicious Securities Pvt Ltd',
  },
  KOTAK_NEO: {
    id: 'kotak',
    name: 'Kotak Neo',
    logo: '🏛️',
    themeColor: 'rose',
    deliveryText: '₹0 (Trade Free Plan)',
    intradayText: '₹0 (Trade Free Plan)',
    foText: 'Flat ₹20 / order',
    dpBaseCharge: 13.0, // ₹13.00 + 18% GST = ₹15.34
    dpTotalWithGst: 15.34,
    deliveryRate: 0,
    deliveryMaxCap: 0,
    intradayRate: 0,
    intradayMaxCap: 0,
    foRate: 20,
    sebiRegNo: 'INZ000200137',
    entityName: 'Kotak Securities Limited',
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom Broker',
    logo: '🛠️',
    themeColor: 'indigo',
    deliveryText: 'Custom Rates',
    intradayText: 'Custom Rates',
    foText: 'Custom Rates',
    dpBaseCharge: 13.5,
    dpTotalWithGst: 15.93,
    deliveryRate: 0.0005,
    deliveryMaxCap: 20,
    intradayRate: 0.0003,
    intradayMaxCap: 20,
    foRate: 20,
    sebiRegNo: 'CUSTOM-001',
    entityName: 'Custom Brokerage Entity',
  },
};

export const BROKER_LIST = Object.values(BROKERS);

export const SEGMENTS = {
  DELIVERY: 'delivery',
  INTRADAY: 'intraday',
  FUTURES: 'futures',
  OPTIONS: 'options',
};

export const EXCHANGES = {
  NSE: 'NSE',
  BSE: 'BSE',
};

export const STOCK_PRESETS = [
  { name: 'Reliance Industries', buyPrice: 2850, sellPrice: 3050, qty: 50, segment: 'delivery', exchange: 'NSE' },
  { name: 'Tata Motors', buyPrice: 880, sellPrice: 960, qty: 100, segment: 'delivery', exchange: 'NSE' },
  { name: 'HDFC Bank', buyPrice: 1620, sellPrice: 1720, qty: 150, segment: 'delivery', exchange: 'NSE' },
  { name: 'Zomato', buyPrice: 210, sellPrice: 265, qty: 500, segment: 'delivery', exchange: 'NSE' },
  { name: 'Intraday Scalp (Nifty Stock)', buyPrice: 1450, sellPrice: 1465, qty: 300, segment: 'intraday', exchange: 'NSE' },
  { name: 'Penny Stock Multibagger', buyPrice: 15, sellPrice: 35, qty: 2000, segment: 'delivery', exchange: 'NSE' },
];

export function calculateCharges({
  buyPrice = 0,
  sellPrice = 0,
  quantity = 0,
  segment = SEGMENTS.DELIVERY,
  exchange = EXCHANGES.NSE,
  brokerId = 'groww',
  customSettings = null,
  buyOrdersCount = 1,
  sellOrdersCount = 1,
  isinCount = 1, // Number of company stocks debited for DP charges
}) {
  const safeBuyPrice = Math.max(0, Number(buyPrice) || 0);
  const safeSellPrice = Math.max(0, Number(sellPrice) || 0);
  const safeQty = Math.max(0, Number(quantity) || 0);
  const safeBuyOrders = Math.max(1, Number(buyOrdersCount) || 1);
  const safeSellOrders = Math.max(1, Number(sellOrdersCount) || 1);
  const safeIsinCount = Math.max(1, Number(isinCount) || 1);

  // Find active broker configuration or construct custom
  let activeBroker = Object.values(BROKERS).find((b) => b.id === brokerId) || BROKERS.GROWW;

  if (brokerId === 'custom' && customSettings) {
    const delivRate = Number(customSettings.deliveryPercent || 0) / 100;
    const delivCap = Number(customSettings.deliveryCap || 0);
    const intraRate = Number(customSettings.intradayPercent || 0) / 100;
    const intraCap = Number(customSettings.intradayCap || 0);
    const foFlat = Number(customSettings.foRate || 0);
    const dpBase = Number(customSettings.dpBase || 0);

    activeBroker = {
      ...activeBroker,
      name: customSettings.name || 'Custom Broker',
      deliveryRate: delivRate,
      deliveryMaxCap: delivCap,
      intradayRate: intraRate,
      intradayMaxCap: intraCap,
      foRate: foFlat,
      dpBaseCharge: dpBase,
      dpTotalWithGst: dpBase + dpBase * 0.18,
      deliveryText: delivRate === 0 && delivCap === 0 ? '₹0 Free' : `₹${delivCap} or ${(delivRate * 100).toFixed(3)}% max`,
      intradayText: intraRate === 0 && intraCap === 0 ? '₹0 Free' : `₹${intraCap} or ${(intraRate * 100).toFixed(3)}% max`,
      foText: `Flat ₹${foFlat} / order`,
    };
  }

  const buyTurnover = safeBuyPrice * safeQty;
  const sellTurnover = safeSellPrice * safeQty;
  const totalTurnover = buyTurnover + sellTurnover;

  // 1. Brokerage based on selected broker:
  let buyBrokerage = 0;
  let sellBrokerage = 0;

  if (segment === SEGMENTS.DELIVERY) {
    const buyOrderTurnover = buyTurnover / safeBuyOrders;
    const singleBuy = activeBroker.deliveryRate === 0 && activeBroker.deliveryMaxCap === 0
      ? 0
      : activeBroker.deliveryMaxCap > 0 && activeBroker.deliveryRate > 0
      ? Math.min(activeBroker.deliveryMaxCap, buyOrderTurnover * activeBroker.deliveryRate)
      : activeBroker.deliveryMaxCap > 0
      ? activeBroker.deliveryMaxCap
      : buyOrderTurnover * activeBroker.deliveryRate;
    buyBrokerage = singleBuy * safeBuyOrders;

    const sellOrderTurnover = sellTurnover / safeSellOrders;
    const singleSell = activeBroker.deliveryRate === 0 && activeBroker.deliveryMaxCap === 0
      ? 0
      : activeBroker.deliveryMaxCap > 0 && activeBroker.deliveryRate > 0
      ? Math.min(activeBroker.deliveryMaxCap, sellOrderTurnover * activeBroker.deliveryRate)
      : activeBroker.deliveryMaxCap > 0
      ? activeBroker.deliveryMaxCap
      : sellOrderTurnover * activeBroker.deliveryRate;
    sellBrokerage = singleSell * safeSellOrders;
  } else if (segment === SEGMENTS.INTRADAY) {
    const buyOrderTurnover = buyTurnover / safeBuyOrders;
    const singleBuy = activeBroker.intradayRate === 0 && activeBroker.intradayMaxCap === 0
      ? 0
      : activeBroker.intradayMaxCap > 0 && activeBroker.intradayRate > 0
      ? Math.min(activeBroker.intradayMaxCap, buyOrderTurnover * activeBroker.intradayRate)
      : activeBroker.intradayMaxCap > 0
      ? activeBroker.intradayMaxCap
      : buyOrderTurnover * activeBroker.intradayRate;
    buyBrokerage = singleBuy * safeBuyOrders;

    const sellOrderTurnover = sellTurnover / safeSellOrders;
    const singleSell = activeBroker.intradayRate === 0 && activeBroker.intradayMaxCap === 0
      ? 0
      : activeBroker.intradayMaxCap > 0 && activeBroker.intradayRate > 0
      ? Math.min(activeBroker.intradayMaxCap, sellOrderTurnover * activeBroker.intradayRate)
      : activeBroker.intradayMaxCap > 0
      ? activeBroker.intradayMaxCap
      : sellOrderTurnover * activeBroker.intradayRate;
    sellBrokerage = singleSell * safeSellOrders;
  } else if (segment === SEGMENTS.FUTURES || segment === SEGMENTS.OPTIONS) {
    buyBrokerage = activeBroker.foRate * safeBuyOrders;
    sellBrokerage = activeBroker.foRate * safeSellOrders;
  }

  const totalBrokerage = buyBrokerage + sellBrokerage;

  // 2. STT (Securities Transaction Tax) / CTT (Statutory across all brokers)
  let buySTT = 0;
  let sellSTT = 0;

  if (segment === SEGMENTS.DELIVERY) {
    buySTT = Math.round(buyTurnover * 0.001);
    sellSTT = Math.round(sellTurnover * 0.001);
  } else if (segment === SEGMENTS.INTRADAY) {
    buySTT = 0;
    sellSTT = Math.round(sellTurnover * 0.00025);
  } else if (segment === SEGMENTS.FUTURES) {
    buySTT = 0;
    sellSTT = Math.round(sellTurnover * 0.0002);
  } else if (segment === SEGMENTS.OPTIONS) {
    buySTT = 0;
    sellSTT = Math.round(sellTurnover * 0.00125);
  }

  const totalSTT = buySTT + sellSTT;

  // 3. Exchange Transaction Charges
  let exchangeRate = 0.0000297;
  if (exchange === EXCHANGES.NSE) {
    if (segment === SEGMENTS.DELIVERY || segment === SEGMENTS.INTRADAY) {
      exchangeRate = 0.0000297;
    } else if (segment === SEGMENTS.FUTURES) {
      exchangeRate = 0.0000173;
    } else if (segment === SEGMENTS.OPTIONS) {
      exchangeRate = 0.0003503;
    }
  } else {
    // BSE
    if (segment === SEGMENTS.DELIVERY || segment === SEGMENTS.INTRADAY) {
      exchangeRate = 0.0000375;
    } else if (segment === SEGMENTS.FUTURES) {
      exchangeRate = 0.0000005;
    } else if (segment === SEGMENTS.OPTIONS) {
      exchangeRate = 0.000325;
    }
  }

  const buyExchangeTxn = buyTurnover * exchangeRate;
  const sellExchangeTxn = sellTurnover * exchangeRate;
  const totalExchangeTxn = buyExchangeTxn + sellExchangeTxn;

  // 4. DP (Depository Participant) Charges based on active broker:
  let dpBaseCharge = 0;
  if (segment === SEGMENTS.DELIVERY && safeQty > 0 && safeSellPrice > 0) {
    dpBaseCharge = activeBroker.dpBaseCharge * safeIsinCount;
  }
  const dpGST = dpBaseCharge * 0.18;
  const totalDPCharge = dpBaseCharge + dpGST;

  // 5. SEBI Turnover Charges: ₹10 per crore (0.0001% of turnover)
  const sebiRate = 0.000001;
  const buySebi = buyTurnover * sebiRate;
  const sellSebi = sellTurnover * sebiRate;
  const totalSebi = buySebi + sellSebi;

  // 6. Stamp Duty:
  let stampDutyRate = 0.00015;
  if (segment === SEGMENTS.DELIVERY) stampDutyRate = 0.00015;
  else if (segment === SEGMENTS.INTRADAY) stampDutyRate = 0.00003;
  else if (segment === SEGMENTS.FUTURES) stampDutyRate = 0.00002;
  else if (segment === SEGMENTS.OPTIONS) stampDutyRate = 0.00003;

  const totalStampDuty = Math.round(buyTurnover * stampDutyRate);

  // 7. IPFT (Investor Protection Fund Trust):
  let ipftRate = 0;
  if (exchange === EXCHANGES.NSE) {
    ipftRate = 0.000001;
  }
  const totalIPFT = totalTurnover * ipftRate;

  // 8. GST (18% on Brokerage + Exchange Txn + SEBI + DP Base Charge)
  const taxableValue = totalBrokerage + totalExchangeTxn + totalSebi + dpBaseCharge;
  const totalGST = taxableValue * 0.18;

  // Total Taxes and Charges
  const totalCharges = totalBrokerage + totalSTT + totalExchangeTxn + totalDPCharge + totalSebi + totalStampDuty + totalIPFT + (totalGST - dpGST);

  // P&L Calculations
  const grossPnL = sellTurnover - buyTurnover;
  const grossROI = buyTurnover > 0 ? (grossPnL / buyTurnover) * 100 : 0;
  const netPnL = grossPnL - totalCharges;
  const netROI = buyTurnover > 0 ? (netPnL / buyTurnover) * 100 : 0;

  // Points to Breakeven
  const pointsToBreakeven = safeQty > 0 ? totalCharges / safeQty : 0;
  const breakevenPrice = safeBuyPrice + pointsToBreakeven;

  // Percentage of gains taken by fees
  const chargePercentageOfProfit = grossPnL > 0 ? (totalCharges / grossPnL) * 100 : 0;

  return {
    broker: activeBroker,
    buyTurnover,
    sellTurnover,
    totalTurnover,
    grossPnL,
    grossROI,
    netPnL,
    netROI,
    totalCharges,
    pointsToBreakeven,
    breakevenPrice,
    chargePercentageOfProfit,
    breakdown: {
      brokerage: {
        buy: buyBrokerage,
        sell: sellBrokerage,
        total: totalBrokerage,
        description: segment === SEGMENTS.DELIVERY
          ? activeBroker.deliveryText
          : segment === SEGMENTS.INTRADAY
          ? activeBroker.intradayText
          : activeBroker.foText,
      },
      stt: {
        buy: buySTT,
        sell: sellSTT,
        total: totalSTT,
        description: segment === SEGMENTS.DELIVERY ? '0.1% on both Buy and Sell turnover' : segment === SEGMENTS.INTRADAY ? '0.025% on Sell turnover' : '0.02% (Futures) / 0.125% (Options) on Sell',
      },
      exchangeTxn: {
        buy: buyExchangeTxn,
        sell: sellExchangeTxn,
        total: totalExchangeTxn,
        description: `${exchange} transaction charges (${(exchangeRate * 100).toFixed(5)}%)`,
      },
      dpCharges: {
        base: dpBaseCharge,
        gst: dpGST,
        total: totalDPCharge,
        description: segment === SEGMENTS.DELIVERY ? `₹${activeBroker.dpBaseCharge.toFixed(2)} + 18% GST (₹${activeBroker.dpTotalWithGst.toFixed(2)} per stock debit on Sell)` : '₹0 for Intraday/F&O',
      },
      gst: {
        taxableValue,
        total: totalGST,
        description: '18% GST on (Brokerage + Exchange Txn + SEBI + DP Charges)',
      },
      sebiCharges: {
        buy: buySebi,
        sell: sellSebi,
        total: totalSebi,
        description: '₹10 per crore (0.0001% of turnover)',
      },
      stampDuty: {
        total: totalStampDuty,
        description: `${(stampDutyRate * 100).toFixed(4)}% on BUY turnover`,
      },
      ipft: {
        total: totalIPFT,
        description: '₹10 per crore on turnover (NSE Investor Protection Fund)',
      },
    },
  };
}

/**
 * Compare charges across all supported Indian discount brokers for the same trade.
 */
export function getBrokerComparison({ buyPrice, sellPrice, quantity, segment = SEGMENTS.DELIVERY, exchange = EXCHANGES.NSE, selectedBrokerId = 'groww', customSettings = null }) {
  const brokers = Object.values(BROKERS);

  return brokers.map((b) => {
    const res = calculateCharges({
      buyPrice,
      sellPrice,
      quantity,
      segment,
      exchange,
      brokerId: b.id,
      customSettings: b.id === 'custom' ? customSettings : null,
    });

    return {
      broker: res.broker.name,
      brokerId: b.id,
      logo: b.logo,
      brokerage: res.breakdown.brokerage.total,
      totalCharges: res.totalCharges,
      netPnL: res.netPnL,
      isCurrent: b.id === selectedBrokerId,
      color: b.themeColor,
      deliveryFeeText: segment === SEGMENTS.DELIVERY ? res.broker.deliveryText : segment === SEGMENTS.INTRADAY ? res.broker.intradayText : res.broker.foText,
    };
  });
}

/**
 * Format currency in Indian numbering format (e.g. ₹1,25,000.50)
 */
export function formatINR(val, showDecimals = true) {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00';
  const num = Number(val);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = absNum.toLocaleString('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}
