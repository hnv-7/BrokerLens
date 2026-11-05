import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/broker.dart';
import '../models/portfolio_item.dart';
import '../models/trade_calculation.dart';
import '../providers/calculator_provider.dart';
import '../services/calculator_service.dart';

class PortfolioScreen extends StatelessWidget {
  const PortfolioScreen({Key? key}) : super(key: key);

  void _showAddDialog(BuildContext context) {
    final provider = context.read<CalculatorProvider>();
    final nameCtrl = TextEditingController();
    final buyCtrl = TextEditingController();
    final sellCtrl = TextEditingController();
    final qtyCtrl = TextEditingController(text: '10');
    String selectedBrokerId = provider.selectedBroker.id;

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Add Stock Position', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(labelText: 'Stock Name (e.g. Infosys)'),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: selectedBrokerId,
                      items: Broker.defaultBrokers.map((b) {
                        return DropdownMenuItem(value: b.id, child: Text('${b.logo} ${b.name}'));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setDialogState(() => selectedBrokerId = val);
                      },
                      decoration: const InputDecoration(labelText: 'Broker'),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: buyCtrl,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(labelText: 'Buy Price (₹)'),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: sellCtrl,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(labelText: 'Sell Price (₹)'),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: qtyCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Quantity'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    final name = nameCtrl.text.trim();
                    final buy = double.tryParse(buyCtrl.text) ?? 0.0;
                    final sell = double.tryParse(sellCtrl.text) ?? 0.0;
                    final q = int.tryParse(qtyCtrl.text) ?? 1;

                    if (name.isNotEmpty && buy > 0 && sell > 0 && q > 0) {
                      provider.addPortfolioItem(
                        PortfolioItem(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          stockName: name,
                          brokerId: selectedBrokerId,
                          buyPrice: buy,
                          sellPrice: sell,
                          quantity: q,
                        ),
                      );
                      Navigator.pop(ctx);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00D09C),
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Add Position'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CalculatorProvider>();
    final items = provider.portfolio;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Calculate aggregated portfolio totals
    double totalInvested = 0;
    double totalCurrent = 0;
    double totalCharges = 0;
    double totalNetPnL = 0;

    final evaluated = items.map((item) {
      final b = Broker.getById(item.brokerId);
      final calc = CalculatorService.calculate(
        buyPrice: item.buyPrice,
        sellPrice: item.sellPrice,
        quantity: item.quantity,
        broker: b,
        segment: item.segment,
        exchange: item.exchange,
      );

      totalInvested += calc.buyTurnover;
      totalCurrent += calc.sellTurnover;
      totalCharges += calc.totalCharges;
      totalNetPnL += calc.netPnL;

      return {'item': item, 'calc': calc, 'broker': b};
    }).toList();

    final totalROI = totalInvested > 0 ? (totalNetPnL / totalInvested) * 100 : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Multi-Stock Portfolio'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: Color(0xFF00D09C)),
            tooltip: 'Add Stock',
            onPressed: () => _showAddDialog(context),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Aggregated Portfolio Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: totalNetPnL >= 0
                  ? const Color(0xFF10B981).withOpacity(isDark ? 0.2 : 0.08)
                  : const Color(0xFFEF4444).withOpacity(isDark ? 0.2 : 0.08),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: totalNetPnL >= 0 ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('PORTFOLIO NET P&L', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.8)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: (totalNetPnL >= 0 ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${totalROI >= 0 ? '+' : ''}${totalROI.toStringAsFixed(2)}% ROI',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: totalNetPnL >= 0 ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  CalculatorService.formatINR(totalNetPnL),
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: totalNetPnL >= 0 ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                  ),
                ),
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildSummaryItem('Total Invested', CalculatorService.formatINR(totalInvested)),
                    _buildSummaryItem('Current Value', CalculatorService.formatINR(totalCurrent)),
                    _buildSummaryItem('Total Charges', CalculatorService.formatINR(totalCharges), color: const Color(0xFFF59E0B)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Positions List
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Holdings & Positions (${items.length})',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
              ),
              TextButton.icon(
                onPressed: () => _showAddDialog(context),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add Stock', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 8),

          if (items.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: const Text('No positions added yet. Tap "+ Add Stock" to begin!'),
            )
          else
            ...evaluated.map((entry) {
              final item = entry['item'] as PortfolioItem;
              final calc = entry['calc'] as TradeCalculationResult;
              final broker = entry['broker'] as Broker;
              final isProfit = calc.netPnL >= 0;

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Text(broker.logo, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.stockName, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                          Text(
                            '${item.quantity} shares • Buy: ${CalculatorService.formatINR(item.buyPrice)} → Sell: ${CalculatorService.formatINR(item.sellPrice)}',
                            style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                          ),
                          Text(
                            'Fees: ${CalculatorService.formatINR(calc.totalCharges)} (${broker.name})',
                            style: const TextStyle(fontSize: 10, color: Color(0xFFF59E0B), fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          CalculatorService.formatINR(calc.netPnL),
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 14,
                            color: isProfit ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          ),
                        ),
                        Text(
                          '${calc.netROI >= 0 ? '+' : ''}${calc.netROI.toStringAsFixed(1)}%',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isProfit ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 18, color: Colors.grey),
                      onPressed: () => provider.removePortfolioItem(item.id),
                    ),
                  ],
                ),
              );
            }).toList(),
        ],
      ),
    );
  }

  Widget _buildSummaryItem(String label, String val, {Color? color}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        Text(val, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: color)),
      ],
    );
  }
}
