import 'package:flutter_test/flutter_test.dart';
import 'package:brokerlens_mobile/models/broker.dart';
import 'package:brokerlens_mobile/models/trade_calculation.dart';
import 'package:brokerlens_mobile/services/calculator_service.dart';

void main() {
  group('CalculatorService Tests', () {
    test('Calculates Groww Delivery Trade Charges Accurately', () {
      final groww = Broker.getById('groww');
      // Buy 4 shares at 962.75 (Total Invested = 3851)
      // Sell 4 shares at 1067.00 (Total Current Value = 4268)
      final res = CalculatorService.calculate(
        buyPrice: 962.75,
        sellPrice: 1067.00,
        quantity: 4,
        broker: groww,
        segment: TradeSegment.delivery,
        exchange: StockExchange.nse,
      );

      expect(res.buyTurnover, 3851.0);
      expect(res.sellTurnover, 4268.0);
      expect(res.grossPnL, 417.0);

      // Groww brokerage: min(20, 3851 * 0.05%) = min(20, 1.9255) = 1.9255
      expect(res.breakdown.brokerage.buy, closeTo(1.9255, 0.01));
      // DP Charges on Groww delivery = ₹13.50 + 18% GST = ₹15.93
      expect(res.breakdown.dpCharges.total, closeTo(15.93, 0.01));

      // Net P&L should be positive
      expect(res.netPnL, greaterThan(0));
      expect(res.netPnL, lessThan(res.grossPnL));
    });

    test('Calculates Zerodha Free Delivery Trade', () {
      final zerodha = Broker.getById('zerodha');
      final res = CalculatorService.calculate(
        buyPrice: 1000.0,
        sellPrice: 1100.0,
        quantity: 10,
        broker: zerodha,
        segment: TradeSegment.delivery,
        exchange: StockExchange.nse,
      );

      // Zerodha delivery brokerage is ₹0
      expect(res.breakdown.brokerage.total, 0.0);
      // DP charge still applies on sell side
      expect(res.breakdown.dpCharges.total, closeTo(15.93, 0.01));
    });

    test('Solves Reverse Target Price Accurately', () {
      final groww = Broker.getById('groww');
      const buyPrice = 500.0;
      const qty = 100;
      const targetNet = 5000.0;

      final sellPrice = CalculatorService.solveTargetSellPrice(
        buyPrice: buyPrice,
        quantity: qty,
        targetNetProfit: targetNet,
        broker: groww,
      );

      final check = CalculatorService.calculate(
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        quantity: qty,
        broker: groww,
      );

      expect(check.netPnL, closeTo(targetNet, 5.0));
    });
  });
}
