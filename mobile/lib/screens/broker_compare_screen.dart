import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/broker.dart';
import '../providers/calculator_provider.dart';
import '../services/calculator_service.dart';

class BrokerCompareScreen extends StatelessWidget {
  const BrokerCompareScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CalculatorProvider>();
    final buyPrice = provider.effectiveBuyPrice;
    final sellPrice = provider.effectiveSellPrice;
    final qty = provider.quantity;
    final segment = provider.segment;
    final exchange = provider.exchange;
    final activeBroker = provider.selectedBroker;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final comparisons = Broker.defaultBrokers.map((b) {
      final res = CalculatorService.calculate(
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        quantity: qty,
        broker: b,
        segment: segment,
        exchange: exchange,
      );
      return {'broker': b, 'result': res, 'isActive': b.id == activeBroker.id};
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Broker Comparison'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Trade info summary
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Trade Comparison Value', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w600)),
                    Text(
                      CalculatorService.formatINR(buyPrice * qty),
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
                Text(
                  '$qty shares • ${segment.name.toUpperCase()}',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF00D09C)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Comparison Cards
          ...comparisons.map((c) {
            final broker = c['broker'] as Broker;
            final res = c['result'] as dynamic;
            final isActive = c['isActive'] as bool;
            final isProfit = res.netPnL >= 0;

            return InkWell(
              onTap: () {
                provider.setBroker(broker);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${broker.name} set as active broker!'),
                    duration: const Duration(seconds: 1),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isActive
                        ? const Color(0xFF00D09C)
                        : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                    width: isActive ? 2 : 1,
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(broker.logo, style: const TextStyle(fontSize: 22)),
                            const SizedBox(width: 8),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(broker.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                                Text(broker.deliveryText, style: TextStyle(fontSize: 10, color: Colors.grey[500])),
                              ],
                            ),
                          ],
                        ),
                        if (isActive)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFF00D09C),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text('ACTIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800)),
                          )
                        else
                          Text('Tap to select', style: TextStyle(fontSize: 11, color: Colors.grey[400])),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Divider(height: 1),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildMetric('Brokerage', CalculatorService.formatINR(res.breakdown.brokerage.total)),
                        _buildMetric('Total Taxes & Fees', CalculatorService.formatINR(res.totalCharges), color: const Color(0xFFF59E0B)),
                        _buildMetric(
                          'Net Take-Home',
                          CalculatorService.formatINR(res.netPnL),
                          color: isProfit ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          isBold: true,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildMetric(String label, String val, {Color? color, bool isBold = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        Text(
          val,
          style: TextStyle(
            fontSize: isBold ? 13 : 11,
            fontWeight: isBold ? FontWeight.w900 : FontWeight.w700,
            fontFamily: 'monospace',
            color: color,
          ),
        ),
      ],
    );
  }
}
