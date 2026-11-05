import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/calculator_provider.dart';
import '../services/calculator_service.dart';

class TargetReverseScreen extends StatefulWidget {
  const TargetReverseScreen({Key? key}) : super(key: key);

  @override
  State<TargetReverseScreen> createState() => _TargetReverseScreenState();
}

class _TargetReverseScreenState extends State<TargetReverseScreen> {
  double _desiredNetProfit = 5000.0;
  late TextEditingController _targetController;

  @override
  void initState() {
    super.initState();
    _targetController = TextEditingController(text: _desiredNetProfit.toStringAsFixed(0));
  }

  @override
  void dispose() {
    _targetController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CalculatorProvider>();
    final buyPrice = provider.effectiveBuyPrice;
    final qty = provider.quantity;
    final broker = provider.selectedBroker;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final requiredSellPrice = CalculatorService.solveTargetSellPrice(
      buyPrice: buyPrice,
      quantity: qty,
      targetNetProfit: _desiredNetProfit,
      broker: broker,
      segment: provider.segment,
      exchange: provider.exchange,
    );

    final sim = CalculatorService.calculate(
      buyPrice: buyPrice,
      sellPrice: requiredSellPrice,
      quantity: qty,
      broker: broker,
      segment: provider.segment,
      exchange: provider.exchange,
    );

    final pointsNeeded = requiredSellPrice - buyPrice;
    final pctNeeded = buyPrice > 0 ? (pointsNeeded / buyPrice) * 100 : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Target / Reverse Calculator'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Target Input Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Desired Net Take-Home Profit (₹)',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _targetController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                  onChanged: (val) {
                    setState(() {
                      _desiredNetProfit = double.tryParse(val) ?? 0.0;
                    });
                  },
                  decoration: InputDecoration(
                    prefixIcon: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
                      child: Text('₹', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF00D09C))),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
                    filled: true,
                    fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 10),

                // Quick Pills
                Wrap(
                  spacing: 6,
                  children: [1000, 2500, 5000, 10000, 25000].map((amt) {
                    final isSel = _desiredNetProfit == amt.toDouble();
                    return ActionChip(
                      label: Text('₹${amt.toString()}', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: isSel ? Colors.white : null)),
                      backgroundColor: isSel ? const Color(0xFF00D09C) : null,
                      onPressed: () {
                        setState(() {
                          _desiredNetProfit = amt.toDouble();
                          _targetController.text = amt.toString();
                        });
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Output Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0D9488), Color(0xFF0F766E)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(color: const Color(0xFF0D9488).withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'REQUIRED SELLING PRICE',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Colors.white70, letterSpacing: 0.8),
                ),
                const SizedBox(height: 6),
                Text(
                  CalculatorService.formatINR(requiredSellPrice),
                  style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w900, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '+${pctNeeded.toStringAsFixed(2)}% Stock Gain (+₹${pointsNeeded.toStringAsFixed(2)} / share)',
                    style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800),
                  ),
                ),
                const SizedBox(height: 16),
                const Divider(color: Colors.white24),
                const SizedBox(height: 12),
                _buildWhiteRow('Gross Profit to Generate', CalculatorService.formatINR(sim.grossPnL)),
                _buildWhiteRow('Taxes & ${broker.name} Fees', '-${CalculatorService.formatINR(sim.totalCharges)}'),
                const Divider(color: Colors.white24),
                _buildWhiteRow('Final Net In-Hand Profit', CalculatorService.formatINR(sim.netPnL), isBold: true),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Trade Basis Info
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _buildRow('Active Broker', broker.name),
                _buildRow('Buy Price', CalculatorService.formatINR(buyPrice)),
                _buildRow('Quantity', '$qty shares'),
                _buildRow('Total Capital Invested', CalculatorService.formatINR(buyPrice * qty)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWhiteRow(String title, String val, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12, fontWeight: isBold ? FontWeight.w800 : FontWeight.w500)),
          Text(val, style: TextStyle(color: Colors.white, fontSize: isBold ? 14 : 12, fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }

  Widget _buildRow(String title, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}
