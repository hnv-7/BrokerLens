import 'broker.dart';

enum TradeSegment { delivery, intraday, futures, options }
enum StockExchange { nse, bse }

class BreakdownItem {
  final double buy;
  final double sell;
  final double total;
  final String description;

  const BreakdownItem({
    required this.buy,
    required this.sell,
    required this.total,
    required this.description,
  });
}

class ChargesBreakdown {
  final BreakdownItem brokerage;
  final BreakdownItem stt;
  final BreakdownItem exchangeTxn;
  final BreakdownItem dpCharges;
  final BreakdownItem gst;
  final BreakdownItem sebiCharges;
  final BreakdownItem stampDuty;
  final BreakdownItem ipft;

  const ChargesBreakdown({
    required this.brokerage,
    required this.stt,
    required this.exchangeTxn,
    required this.dpCharges,
    required this.gst,
    required this.sebiCharges,
    required this.stampDuty,
    required this.ipft,
  });
}

class TradeCalculationResult {
  final Broker broker;
  final double buyPrice;
  final double sellPrice;
  final int quantity;
  final TradeSegment segment;
  final StockExchange exchange;
  final double buyTurnover;
  final double sellTurnover;
  final double totalTurnover;
  final double grossPnL;
  final double grossROI;
  final double netPnL;
  final double netROI;
  final double totalCharges;
  final double pointsToBreakeven;
  final double breakevenPrice;
  final double chargePercentageOfProfit;
  final ChargesBreakdown breakdown;

  const TradeCalculationResult({
    required this.broker,
    required this.buyPrice,
    required this.sellPrice,
    required this.quantity,
    required this.segment,
    required this.exchange,
    required this.buyTurnover,
    required this.sellTurnover,
    required this.totalTurnover,
    required this.grossPnL,
    required this.grossROI,
    required this.netPnL,
    required this.netROI,
    required this.totalCharges,
    required this.pointsToBreakeven,
    required this.breakevenPrice,
    required this.chargePercentageOfProfit,
    required this.breakdown,
  });
}
