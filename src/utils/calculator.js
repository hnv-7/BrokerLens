/**
 * Groww Brokerage and Charges Calculation Engine
 * Based on official Groww pricing structure (https://groww.in/pricing) and Indian stock market statutory regulations.
 */

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

  const buyTurnover = safeBuyPrice * safeQty;
  const sellTurnover = safeSellPrice * safeQty;
  const totalTurnover = buyTurnover + sellTurnover;

  // 1. Brokerage:
  // Groww Equity Delivery & Intraday: ₹20 or 0.05% of order value per executed order, whichever is lower.
  // F&O: Flat ₹20 per executed order.
  let buyBrokerage = 0;
  let sellBrokerage = 0;

  if (segment === SEGMENTS.DELIVERY || segment === SEGMENTS.INTRADAY) {
    // 0.05% or Rs 20 whichever is lower per order
    const buyOrderTurnover = buyTurnover / safeBuyOrders;
    const singleBuyBrokerage = Math.min(20, buyOrderTurnover * 0.0005);
    buyBrokerage = singleBuyBrokerage * safeBuyOrders;

    const sellOrderTurnover = sellTurnover / safeSellOrders;
    const singleSellBrokerage = Math.min(20, sellOrderTurnover * 0.0005);
    sellBrokerage = singleSellBrokerage * safeSellOrders;
  } else if (segment === SEGMENTS.FUTURES || segment === SEGMENTS.OPTIONS) {
    buyBrokerage = 20 * safeBuyOrders;
    sellBrokerage = 20 * safeSellOrders;
  }

  const totalBrokerage = buyBrokerage + sellBrokerage;

  // 2. STT (Securities Transaction Tax) / CTT
  // Delivery: 0.1% on Buy & 0.1% on Sell
  // Intraday: 0.025% on Sell only
  // Futures: 0.02% on Sell only
  // Options: 0.125% on Sell only (on premium)
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
  // NSE:
  //   Equity Delivery/Intraday: 0.00297%
  //   Futures: 0.00173%
  //   Options: 0.03503%
  // BSE:
  //   Equity Delivery/Intraday: 0.00375%
  //   Futures: 0.00005%
  //   Options: 0.0325%
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

  // 4. DP (Depository Participant) Charges
  // Groww DP Charges: ₹13.50 + 18% GST (₹15.93 per company/ISIN debit on SELL side for Delivery only)
  let dpBaseCharge = 0;
  if (segment === SEGMENTS.DELIVERY && safeQty > 0 && safeSellPrice > 0) {
    dpBaseCharge = 13.5 * safeIsinCount;
  }
  const dpGST = dpBaseCharge * 0.18;
  const totalDPCharge = dpBaseCharge + dpGST;

  // 5. SEBI Turnover Charges: ₹10 per crore (0.0001% of turnover)
  const sebiRate = 0.000001; // 10 / 10,000,000
  const buySebi = buyTurnover * sebiRate;
  const sellSebi = sellTurnover * sebiRate;
  const totalSebi = buySebi + sellSebi;

  // 6. Stamp Duty:
  // Delivery: 0.015% on BUY side
  // Intraday: 0.003% on BUY side
  // Futures: 0.002% on BUY side
  // Options: 0.003% on BUY side
  let stampDutyRate = 0.00015;
  if (segment === SEGMENTS.DELIVERY) stampDutyRate = 0.00015;
  else if (segment === SEGMENTS.INTRADAY) stampDutyRate = 0.00003;
  else if (segment === SEGMENTS.FUTURES) stampDutyRate = 0.00002;
  else if (segment === SEGMENTS.OPTIONS) stampDutyRate = 0.00003;

  const totalStampDuty = Math.round(buyTurnover * stampDutyRate);

  // 7. IPFT (Investor Protection Fund Trust):
  // NSE Equity: ₹10 / crore (0.0001%) on turnover
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
  // Calculate price per share increase needed to cover total charges
  const pointsToBreakeven = safeQty > 0 ? totalCharges / safeQty : 0;
  const breakevenPrice = safeBuyPrice + pointsToBreakeven;

  // Percentage of gains taken by fees
  const chargePercentageOfProfit = grossPnL > 0 ? (totalCharges / grossPnL) * 100 : 0;

  return {
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
        description: segment === SEGMENTS.FUTURES || segment === SEGMENTS.OPTIONS ? '₹20 flat per executed order' : '₹20 or 0.05% per order (whichever is lower)',
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
        description: segment === SEGMENTS.DELIVERY ? '₹13.50 + 18% GST (₹15.93 per stock debit on Sell)' : '₹0 for Intraday/F&O',
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
 * Compare charges across popular Indian discount brokers for the same trade.
 */
export function getBrokerComparison({ buyPrice, sellPrice, quantity, segment = SEGMENTS.DELIVERY, exchange = EXCHANGES.NSE }) {
  const growwRes = calculateCharges({ buyPrice, sellPrice, quantity, segment, exchange });
  const buyTurnover = buyPrice * quantity;
  const sellTurnover = sellPrice * quantity;
  const grossPnL = sellTurnover - buyTurnover;

  // Zerodha:
  // Delivery: ₹0 Brokerage (Zero brokerage for Equity Delivery), DP charge ₹13.50 + GST = ₹15.93
  // Intraday: ₹20 or 0.03% (whichever is lower)
  let zerodhaBrokerage = 0;
  if (segment === SEGMENTS.DELIVERY) {
    zerodhaBrokerage = 0;
  } else if (segment === SEGMENTS.INTRADAY) {
    zerodhaBrokerage = Math.min(20, buyTurnover * 0.0003) + Math.min(20, sellTurnover * 0.0003);
  } else {
    zerodhaBrokerage = 40;
  }
  const zerodhaDP = segment === SEGMENTS.DELIVERY ? 15.93 : 0;
  const zerodhaTaxable = zerodhaBrokerage + growwRes.breakdown.exchangeTxn.total + growwRes.breakdown.sebiCharges.total + (segment === SEGMENTS.DELIVERY ? 13.5 : 0);
  const zerodhaGST = zerodhaTaxable * 0.18;
  const zerodhaTotalCharges = zerodhaBrokerage + growwRes.breakdown.stt.total + growwRes.breakdown.exchangeTxn.total + zerodhaDP + growwRes.breakdown.sebiCharges.total + growwRes.breakdown.stampDuty.total + growwRes.breakdown.ipft.total + (zerodhaGST - (segment === SEGMENTS.DELIVERY ? 13.5 * 0.18 : 0));

  // Angel One:
  // Delivery: ₹20 or 0.1% whichever is lower (or ₹0 for first 30 days, standard ₹20 or 0.1%)
  // Intraday: ₹20 or 0.25% whichever lower
  let angelBrokerage = 0;
  if (segment === SEGMENTS.DELIVERY) {
    angelBrokerage = Math.min(20, buyTurnover * 0.001) + Math.min(20, sellTurnover * 0.001);
  } else if (segment === SEGMENTS.INTRADAY) {
    angelBrokerage = Math.min(20, buyTurnover * 0.0025) + Math.min(20, sellTurnover * 0.0025);
  } else {
    angelBrokerage = 40;
  }
  const angelDP = segment === SEGMENTS.DELIVERY ? 23.6 : 0; // ₹20 + 18% GST = ₹23.60
  const angelTaxable = angelBrokerage + growwRes.breakdown.exchangeTxn.total + growwRes.breakdown.sebiCharges.total + (segment === SEGMENTS.DELIVERY ? 20 : 0);
  const angelGST = angelTaxable * 0.18;
  const angelTotalCharges = angelBrokerage + growwRes.breakdown.stt.total + growwRes.breakdown.exchangeTxn.total + angelDP + growwRes.breakdown.sebiCharges.total + growwRes.breakdown.stampDuty.total + growwRes.breakdown.ipft.total + (angelGST - (segment === SEGMENTS.DELIVERY ? 20 * 0.18 : 0));

  // Upstox:
  // Delivery: ₹20 or 2.5% whichever lower
  // Intraday: ₹20 or 0.05% whichever lower
  let upstoxBrokerage = 0;
  if (segment === SEGMENTS.DELIVERY) {
    upstoxBrokerage = Math.min(20, buyTurnover * 0.025) + Math.min(20, sellTurnover * 0.025);
  } else {
    upstoxBrokerage = Math.min(20, buyTurnover * 0.0005) + Math.min(20, sellTurnover * 0.0005);
  }
  const upstoxDP = segment === SEGMENTS.DELIVERY ? 21.83 : 0; // ₹18.5 + GST = ₹21.83
  const upstoxTaxable = upstoxBrokerage + growwRes.breakdown.exchangeTxn.total + growwRes.breakdown.sebiCharges.total + (segment === SEGMENTS.DELIVERY ? 18.5 : 0);
  const upstoxGST = upstoxTaxable * 0.18;
  const upstoxTotalCharges = upstoxBrokerage + growwRes.breakdown.stt.total + growwRes.breakdown.exchangeTxn.total + upstoxDP + growwRes.breakdown.sebiCharges.total + growwRes.breakdown.stampDuty.total + growwRes.breakdown.ipft.total + (upstoxGST - (segment === SEGMENTS.DELIVERY ? 18.5 * 0.18 : 0));

  return [
    {
      broker: 'Groww',
      logo: '🌱',
      brokerage: growwRes.breakdown.brokerage.total,
      totalCharges: growwRes.totalCharges,
      netPnL: grossPnL - growwRes.totalCharges,
      isCurrent: true,
      color: 'emerald',
      deliveryFeeText: '₹20 or 0.05% (Max ₹20)',
    },
    {
      broker: 'Zerodha',
      logo: '🪁',
      brokerage: zerodhaBrokerage,
      totalCharges: zerodhaTotalCharges,
      netPnL: grossPnL - zerodhaTotalCharges,
      isCurrent: false,
      color: 'blue',
      deliveryFeeText: '₹0 (Free Delivery)',
    },
    {
      broker: 'Angel One',
      logo: '👼',
      brokerage: angelBrokerage,
      totalCharges: angelTotalCharges,
      netPnL: grossPnL - angelTotalCharges,
      isCurrent: false,
      color: 'red',
      deliveryFeeText: '₹20 or 0.1%',
    },
    {
      broker: 'Upstox',
      logo: '🚀',
      brokerage: upstoxBrokerage,
      totalCharges: upstoxTotalCharges,
      netPnL: grossPnL - upstoxTotalCharges,
      isCurrent: false,
      color: 'purple',
      deliveryFeeText: '₹20 or 2.5%',
    },
  ];
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
