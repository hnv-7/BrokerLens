import 'dart:math';
import 'package:intl/intl.dart';
import '../models/broker.dart';
import '../models/trade_calculation.dart';

class CalculatorService {
  static final NumberFormat inrFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  static String formatINR(double val, {bool showDecimals = true}) {
    final format = NumberFormat.currency(
      locale: 'en_IN',
      symbol: '₹',
      decimalDigits: showDecimals ? 2 : 0,
    );
    return format.format(val);
  }

  static TradeCalculationResult calculate({
    required double buyPrice,
    required double sellPrice,
    required int quantity,
    required Broker broker,
    TradeSegment segment = TradeSegment.delivery,
    StockExchange exchange = StockExchange.nse,
    int buyOrdersCount = 1,
    int sellOrdersCount = 1,
    int isinCount = 1,
  }) {
    final safeBuy = max(0.0, buyPrice);
    final safeSell = max(0.0, sellPrice);
    final safeQty = max(0, quantity);
    final safeBuyOrders = max(1, buyOrdersCount);
    final safeSellOrders = max(1, sellOrdersCount);
    final safeIsinCount = max(1, isinCount);

    final buyTurnover = safeBuy * safeQty;
    final sellTurnover = safeSell * safeQty;
    final totalTurnover = buyTurnover + sellTurnover;

    // 1. Brokerage
    double buyBrokerage = 0.0;
    double sellBrokerage = 0.0;

    if (segment == TradeSegment.delivery) {
      final buyOrderTurnover = buyTurnover / safeBuyOrders;
      final singleBuy = (broker.deliveryRate == 0 && broker.deliveryMaxCap == 0)
          ? 0.0
          : (broker.deliveryMaxCap > 0 && broker.deliveryRate > 0)
              ? min(broker.deliveryMaxCap, buyOrderTurnover * broker.deliveryRate)
              : (broker.deliveryMaxCap > 0)
                  ? broker.deliveryMaxCap
                  : buyOrderTurnover * broker.deliveryRate;
      buyBrokerage = singleBuy * safeBuyOrders;

      final sellOrderTurnover = sellTurnover / safeSellOrders;
      final singleSell = (broker.deliveryRate == 0 && broker.deliveryMaxCap == 0)
          ? 0.0
          : (broker.deliveryMaxCap > 0 && broker.deliveryRate > 0)
              ? min(broker.deliveryMaxCap, sellOrderTurnover * broker.deliveryRate)
              : (broker.deliveryMaxCap > 0)
                  ? broker.deliveryMaxCap
                  : sellOrderTurnover * broker.deliveryRate;
      sellBrokerage = singleSell * safeSellOrders;
    } else if (segment == TradeSegment.intraday) {
      final buyOrderTurnover = buyTurnover / safeBuyOrders;
      final singleBuy = (broker.intradayRate == 0 && broker.intradayMaxCap == 0)
          ? 0.0
          : (broker.intradayMaxCap > 0 && broker.intradayRate > 0)
              ? min(broker.intradayMaxCap, buyOrderTurnover * broker.intradayRate)
              : (broker.intradayMaxCap > 0)
                  ? broker.intradayMaxCap
                  : buyOrderTurnover * broker.intradayRate;
      buyBrokerage = singleBuy * safeBuyOrders;

      final sellOrderTurnover = sellTurnover / safeSellOrders;
      final singleSell = (broker.intradayRate == 0 && broker.intradayMaxCap == 0)
          ? 0.0
          : (broker.intradayMaxCap > 0 && broker.intradayRate > 0)
              ? min(broker.intradayMaxCap, sellOrderTurnover * broker.intradayRate)
              : (broker.intradayMaxCap > 0)
                  ? broker.intradayMaxCap
                  : sellOrderTurnover * broker.intradayRate;
      sellBrokerage = singleSell * safeSellOrders;
    } else {
      buyBrokerage = broker.foRate * safeBuyOrders;
      sellBrokerage = broker.foRate * safeSellOrders;
    }

    final totalBrokerage = buyBrokerage + sellBrokerage;

    // 2. STT (Securities Transaction Tax)
    double buySTT = 0.0;
    double sellSTT = 0.0;

    if (segment == TradeSegment.delivery) {
      buySTT = (buyTurnover * 0.001).roundToDouble();
      sellSTT = (sellTurnover * 0.001).roundToDouble();
    } else if (segment == TradeSegment.intraday) {
      buySTT = 0.0;
      sellSTT = (sellTurnover * 0.00025).roundToDouble();
    } else if (segment == TradeSegment.futures) {
      buySTT = 0.0;
      sellSTT = (sellTurnover * 0.0002).roundToDouble();
    } else if (segment == TradeSegment.options) {
      buySTT = 0.0;
      sellSTT = (sellTurnover * 0.00125).roundToDouble();
    }
    final totalSTT = buySTT + sellSTT;

    // 3. Exchange Transaction Charges
    double exchangeRate = 0.0000297; // NSE Delivery/Intraday
    if (exchange == StockExchange.nse) {
      if (segment == TradeSegment.delivery || segment == TradeSegment.intraday) {
        exchangeRate = 0.0000297;
      } else if (segment == TradeSegment.futures) {
        exchangeRate = 0.0000173;
      } else {
        exchangeRate = 0.0003503;
      }
    } else {
      // BSE
      if (segment == TradeSegment.delivery || segment == TradeSegment.intraday) {
        exchangeRate = 0.0000375;
      } else if (segment == TradeSegment.futures) {
        exchangeRate = 0.0000005;
      } else {
        exchangeRate = 0.000325;
      }
    }
    final buyExchangeTxn = buyTurnover * exchangeRate;
    final sellExchangeTxn = sellTurnover * exchangeRate;
    final totalExchangeTxn = buyExchangeTxn + sellExchangeTxn;

    // 4. DP Charges
    double dpBaseCharge = 0.0;
    if (segment == TradeSegment.delivery && safeQty > 0 && safeSell > 0) {
      dpBaseCharge = broker.dpBaseCharge * safeIsinCount;
    }
    final dpGST = dpBaseCharge * 0.18;
    final totalDPCharge = dpBaseCharge + dpGST;

    // 5. SEBI Turnover Charges (₹10 / crore)
    const sebiRate = 0.000001;
    final buySebi = buyTurnover * sebiRate;
    final sellSebi = sellTurnover * sebiRate;
    final totalSebi = buySebi + sellSebi;

    // 6. Stamp Duty (on BUY only)
    double stampDutyRate = 0.00015;
    if (segment == TradeSegment.delivery) {
      stampDutyRate = 0.00015;
    } else if (segment == TradeSegment.intraday) {
      stampDutyRate = 0.00003;
    } else if (segment == TradeSegment.futures) {
      stampDutyRate = 0.00002;
    } else {
      stampDutyRate = 0.00003;
    }
    final totalStampDuty = (buyTurnover * stampDutyRate).roundToDouble();

    // 7. IPFT (Investor Protection Fund)
    double ipftRate = exchange == StockExchange.nse ? 0.000001 : 0.0;
    final totalIPFT = totalTurnover * ipftRate;

    // 8. GST (18% on Brokerage + Exchange + SEBI + Base DP)
    final taxableValue = totalBrokerage + totalExchangeTxn + totalSebi + dpBaseCharge;
    final totalGST = taxableValue * 0.18;

    // Total Charges
    final totalCharges = totalBrokerage +
        totalSTT +
        totalExchangeTxn +
        totalDPCharge +
        totalSebi +
        totalStampDuty +
        totalIPFT +
        (totalGST - dpGST);

    // P&L
    final grossPnL = sellTurnover - buyTurnover;
    final grossROI = buyTurnover > 0 ? (grossPnL / buyTurnover) * 100 : 0.0;
    final netPnL = grossPnL - totalCharges;
    final netROI = buyTurnover > 0 ? (netPnL / buyTurnover) * 100 : 0.0;

    final pointsToBreakeven = safeQty > 0 ? totalCharges / safeQty : 0.0;
    final breakevenPrice = safeBuy + pointsToBreakeven;
    final chargePercentageOfProfit = grossPnL > 0 ? (totalCharges / grossPnL) * 100 : 0.0;

    return TradeCalculationResult(
      broker: broker,
      buyPrice: safeBuy,
      sellPrice: safeSell,
      quantity: safeQty,
      segment: segment,
      exchange: exchange,
      buyTurnover: buyTurnover,
      sellTurnover: sellTurnover,
      totalTurnover: totalTurnover,
      grossPnL: grossPnL,
      grossROI: grossROI,
      netPnL: netPnL,
      netROI: netROI,
      totalCharges: totalCharges,
      pointsToBreakeven: pointsToBreakeven,
      breakevenPrice: breakevenPrice,
      chargePercentageOfProfit: chargePercentageOfProfit,
      breakdown: ChargesBreakdown(
        brokerage: BreakdownItem(
          buy: buyBrokerage,
          sell: sellBrokerage,
          total: totalBrokerage,
          description: segment == TradeSegment.delivery
              ? broker.deliveryText
              : segment == TradeSegment.intraday
                  ? broker.intradayText
                  : broker.foText,
        ),
        stt: BreakdownItem(
          buy: buySTT,
          sell: sellSTT,
          total: totalSTT,
          description: segment == TradeSegment.delivery
              ? '0.1% on Buy and Sell turnover'
              : '0.025% on Sell turnover',
        ),
        exchangeTxn: BreakdownItem(
          buy: buyExchangeTxn,
          sell: sellExchangeTxn,
          total: totalExchangeTxn,
          description: '${exchange.name.toUpperCase()} transaction charges',
        ),
        dpCharges: BreakdownItem(
          buy: 0.0,
          sell: totalDPCharge,
          total: totalDPCharge,
          description: segment == TradeSegment.delivery
              ? '₹${broker.dpBaseCharge.toStringAsFixed(2)} + 18% GST (₹${broker.dpTotalWithGst.toStringAsFixed(2)}/ISIN)'
              : '₹0 for Intraday',
        ),
        gst: BreakdownItem(
          buy: totalGST / 2,
          sell: totalGST / 2,
          total: totalGST,
          description: '18% GST on Services (Brokerage + Txn + SEBI + DP)',
        ),
        sebiCharges: BreakdownItem(
          buy: buySebi,
          sell: sellSebi,
          total: totalSebi,
          description: '₹10 per crore (0.0001%)',
        ),
        stampDuty: BreakdownItem(
          buy: totalStampDuty,
          sell: 0.0,
          total: totalStampDuty,
          description: 'State Stamp Duty on BUY side',
        ),
        ipft: BreakdownItem(
          buy: totalIPFT / 2,
          sell: totalIPFT / 2,
          total: totalIPFT,
          description: 'NSE Investor Protection Fund',
        ),
      ),
    );
  }

  /// Binary search solver for Target Reverse Price
  static double solveTargetSellPrice({
    required double buyPrice,
    required int quantity,
    required double targetNetProfit,
    required Broker broker,
    TradeSegment segment = TradeSegment.delivery,
    StockExchange exchange = StockExchange.nse,
  }) {
    if (buyPrice <= 0 || quantity <= 0) return 0.0;

    double low = buyPrice;
    double high = buyPrice * 5 + 2000;
    double requiredSell = buyPrice;

    for (int i = 0; i < 40; i++) {
      final mid = (low + high) / 2;
      final res = calculate(
        buyPrice: buyPrice,
        sellPrice: mid,
        quantity: quantity,
        broker: broker,
        segment: segment,
        exchange: exchange,
      );

      if (res.netPnL < targetNetProfit) {
        low = mid;
      } else {
        high = mid;
        requiredSell = mid;
      }
    }
    return double.parse(requiredSell.toStringAsFixed(2));
  }
}
