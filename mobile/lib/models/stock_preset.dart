import 'trade_calculation.dart';

class StockPreset {
  final String name;
  final double buyPrice;
  final double sellPrice;
  final int qty;
  final TradeSegment segment;
  final StockExchange exchange;

  const StockPreset({
    required this.name,
    required this.buyPrice,
    required this.sellPrice,
    required this.qty,
    this.segment = TradeSegment.delivery,
    this.exchange = StockExchange.nse,
  });

  static const List<StockPreset> presets = [
    StockPreset(name: 'Reliance Ind.', buyPrice: 2850, sellPrice: 3050, qty: 50),
    StockPreset(name: 'Tata Motors', buyPrice: 880, sellPrice: 960, qty: 100),
    StockPreset(name: 'HDFC Bank', buyPrice: 1620, sellPrice: 1720, qty: 150),
    StockPreset(name: 'Zomato', buyPrice: 210, sellPrice: 265, qty: 500),
    StockPreset(name: 'Intraday Nifty Stock', buyPrice: 1450, sellPrice: 1465, qty: 300, segment: TradeSegment.intraday),
    StockPreset(name: 'Multibagger Idea', buyPrice: 15, sellPrice: 35, qty: 2000),
  ];
}
