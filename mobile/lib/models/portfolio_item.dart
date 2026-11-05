import 'trade_calculation.dart';

class PortfolioItem {
  final String id;
  final String stockName;
  final String brokerId;
  final double buyPrice;
  final double sellPrice;
  final int quantity;
  final TradeSegment segment;
  final StockExchange exchange;

  PortfolioItem({
    required this.id,
    required this.stockName,
    required this.brokerId,
    required this.buyPrice,
    required this.sellPrice,
    required this.quantity,
    this.segment = TradeSegment.delivery,
    this.exchange = StockExchange.nse,
  });

  PortfolioItem copyWith({
    String? id,
    String? stockName,
    String? brokerId,
    double? buyPrice,
    double? sellPrice,
    int? quantity,
    TradeSegment? segment,
    StockExchange? exchange,
  }) {
    return PortfolioItem(
      id: id ?? this.id,
      stockName: stockName ?? this.stockName,
      brokerId: brokerId ?? this.brokerId,
      buyPrice: buyPrice ?? this.buyPrice,
      sellPrice: sellPrice ?? this.sellPrice,
      quantity: quantity ?? this.quantity,
      segment: segment ?? this.segment,
      exchange: exchange ?? this.exchange,
    );
  }
}
