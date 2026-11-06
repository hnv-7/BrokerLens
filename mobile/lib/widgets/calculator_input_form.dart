import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/stock_preset.dart';
import '../models/trade_calculation.dart';
import '../providers/calculator_provider.dart';
import '../services/calculator_service.dart';

class CalculatorInputForm extends StatefulWidget {
  const CalculatorInputForm({Key? key}) : super(key: key);

  @override
  State<CalculatorInputForm> createState() => _CalculatorInputFormState();
}

class _CalculatorInputFormState extends State<CalculatorInputForm> {
  late TextEditingController _investedController;
  late TextEditingController _currentValController;
  late TextEditingController _buyPriceController;
  late TextEditingController _sellPriceController;
  late TextEditingController _qtyController;

  bool _showAdvanced = false;

  @override
  void initState() {
    super.initState();
    final p = context.read<CalculatorProvider>();
    _investedController = TextEditingController(text: p.investedAmount.toStringAsFixed(0));
    _currentValController = TextEditingController(text: p.currentTotalValue.toStringAsFixed(0));
    _buyPriceController = TextEditingController(text: p.buyPrice.toStringAsFixed(2));
    _sellPriceController = TextEditingController(text: p.sellPrice.toStringAsFixed(2));
    _qtyController = TextEditingController(text: p.quantity.toString());
  }

  @override
  void dispose() {
    _investedController.dispose();
    _currentValController.dispose();
    _buyPriceController.dispose();
    _sellPriceController.dispose();
    _qtyController.dispose();
    super.dispose();
  }

  /// Updates the controller text only when its numeric value differs from the
  /// provider value (e.g. preset / quick target applied). Comparing numerically
  /// avoids rewriting the text while the user is typing (such as "100." or an
  /// empty field), which would reset the cursor to the end.
  void _syncDecimal(TextEditingController c, double value, int fractionDigits) {
    final current = double.tryParse(c.text) ?? 0.0;
    if ((current - value).abs() > 0.0001) {
      c.text = value.toStringAsFixed(fractionDigits);
    }
  }

  void _syncControllers(CalculatorProvider p) {
    if (p.inputMode == InputMode.totalAmount) {
      _syncDecimal(_investedController, p.investedAmount, 0);
      _syncDecimal(_currentValController, p.currentTotalValue, 0);
    } else {
      _syncDecimal(_buyPriceController, p.buyPrice, 2);
      _syncDecimal(_sellPriceController, p.sellPrice, 2);
    }
    // Empty quantity is treated as 1 by the provider, so compare the same way.
    if ((int.tryParse(_qtyController.text) ?? 1) != p.quantity) {
      _qtyController.text = p.quantity.toString();
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CalculatorProvider>();
    _syncControllers(provider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Segment & Exchange Row
          Row(
            children: [
              // Segment Dropdown / Pills
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      _buildSegmentTab(provider, TradeSegment.delivery, 'Delivery (CNC)'),
                      _buildSegmentTab(provider, TradeSegment.intraday, 'Intraday (MIS)'),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Exchange selector (NSE / BSE)
              Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    _buildExchangeChip(provider, StockExchange.nse, 'NSE'),
                    _buildExchangeChip(provider, StockExchange.bse, 'BSE'),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Input Mode Selector (Total Amounts vs Per Share Price)
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF00D09C).withOpacity(isDark ? 0.15 : 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF00D09C).withOpacity(0.2)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.tune, size: 16, color: Color(0xFF00D09C)),
                    SizedBox(width: 6),
                    Text(
                      'Input Mode:',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
                Row(
                  children: [
                    ChoiceChip(
                      label: const Text('Total (₹)', style: TextStyle(fontSize: 11)),
                      selected: provider.inputMode == InputMode.totalAmount,
                      onSelected: (_) => provider.setInputMode(InputMode.totalAmount),
                      selectedColor: const Color(0xFF00D09C),
                      labelStyle: TextStyle(
                        color: provider.inputMode == InputMode.totalAmount ? Colors.white : null,
                        fontWeight: FontWeight.w700,
                      ),
                      visualDensity: VisualDensity.compact,
                    ),
                    const SizedBox(width: 4),
                    ChoiceChip(
                      label: const Text('/ Share (₹)', style: TextStyle(fontSize: 11)),
                      selected: provider.inputMode == InputMode.perSharePrice,
                      onSelected: (_) => provider.setInputMode(InputMode.perSharePrice),
                      selectedColor: const Color(0xFF00D09C),
                      labelStyle: TextStyle(
                        color: provider.inputMode == InputMode.perSharePrice ? Colors.white : null,
                        fontWeight: FontWeight.w700,
                      ),
                      visualDensity: VisualDensity.compact,
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Presets Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: StockPreset.presets.map((p) {
                return Padding(
                  padding: const EdgeInsets.only(right: 6.0),
                  child: ActionChip(
                    label: Text(p.name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                    onPressed: () {
                      provider.applyPreset(p);
                    },
                    visualDensity: VisualDensity.compact,
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 14),

          // Main Inputs Grid
          if (provider.inputMode == InputMode.totalAmount) ...[
            _buildInputField(
              label: 'Total Invested Amount (Buy Value)',
              sublabel: 'Avg: ${CalculatorService.formatINR(provider.effectiveBuyPrice)} / share',
              controller: _investedController,
              prefix: '₹',
              onChanged: (val) {
                final d = double.tryParse(val) ?? 0.0;
                provider.setInvestedAmount(d);
              },
            ),
            const SizedBox(height: 12),
            _buildInputField(
              label: 'Total Number of Stocks (Quantity)',
              sublabel: '${provider.quantity} shares total',
              controller: _qtyController,
              prefix: '#',
              onChanged: (val) {
                final q = int.tryParse(val) ?? 1;
                provider.setQuantity(q);
              },
            ),
            const SizedBox(height: 12),
            _buildInputField(
              label: 'Current / Selling Value (Sell Value)',
              sublabel: 'Avg: ${CalculatorService.formatINR(provider.effectiveSellPrice)} / share',
              controller: _currentValController,
              prefix: '₹',
              onChanged: (val) {
                final d = double.tryParse(val) ?? 0.0;
                provider.setCurrentTotalValue(d);
              },
            ),
          ] else ...[
            _buildInputField(
              label: 'Buy Price per Share',
              sublabel: 'Total Buy: ${CalculatorService.formatINR(provider.buyPrice * provider.quantity)}',
              controller: _buyPriceController,
              prefix: '₹',
              onChanged: (val) {
                final d = double.tryParse(val) ?? 0.0;
                provider.setBuyPrice(d);
              },
            ),
            const SizedBox(height: 12),
            _buildInputField(
              label: 'Total Number of Stocks (Quantity)',
              sublabel: '${provider.quantity} shares total',
              controller: _qtyController,
              prefix: '#',
              onChanged: (val) {
                final q = int.tryParse(val) ?? 1;
                provider.setQuantity(q);
              },
            ),
            const SizedBox(height: 12),
            _buildInputField(
              label: 'Current / Selling Price per Share',
              sublabel: 'Total Sell: ${CalculatorService.formatINR(provider.sellPrice * provider.quantity)}',
              controller: _sellPriceController,
              prefix: '₹',
              onChanged: (val) {
                final d = double.tryParse(val) ?? 0.0;
                provider.setSellPrice(d);
              },
            ),
          ],
          const SizedBox(height: 14),

          // Quick Gain Target Pills
          const Text(
            'Quick Target Gains (Sell Value):',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF94A3B8)),
          ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 4,
            children: [
              _buildTargetChip(provider, 2, '+2%'),
              _buildTargetChip(provider, 5, '+5%'),
              _buildTargetChip(provider, 10, '+10%'),
              _buildTargetChip(provider, 20, '+20%'),
              _buildTargetChip(provider, 50, '+50%'),
              _buildTargetChip(provider, 100, '2x (100%)'),
              _buildTargetChip(provider, -5, '-5% SL', isLoss: true),
            ],
          ),
          const SizedBox(height: 10),

          // Advanced settings toggle
          InkWell(
            onTap: () => setState(() => _showAdvanced = !_showAdvanced),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                children: [
                  Icon(
                    _showAdvanced ? Icons.expand_less : Icons.expand_more,
                    size: 16,
                    color: Colors.grey,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Tranches, DP Debits)',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),

          if (_showAdvanced) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildSmallNumberField(
                    'Buy Orders',
                    provider.buyOrdersCount,
                    (v) => provider.setBuyOrdersCount(v),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildSmallNumberField(
                    'Sell Orders',
                    provider.sellOrdersCount,
                    (v) => provider.setSellOrdersCount(v),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildSmallNumberField(
                    'ISIN Debited',
                    provider.isinCount,
                    (v) => provider.setIsinCount(v),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSegmentTab(CalculatorProvider p, TradeSegment seg, String title) {
    final isSelected = p.segment == seg;
    return Expanded(
      child: GestureDetector(
        onTap: () => p.setSegment(seg),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF00D09C) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          alignment: Alignment.center,
          child: Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: isSelected ? Colors.white : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildExchangeChip(CalculatorProvider p, StockExchange ex, String title) {
    final isSelected = p.exchange == ex;
    return GestureDetector(
      onTap: () => p.setExchange(ex),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF00D09C) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        alignment: Alignment.center,
        child: Text(
          title,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : Colors.grey,
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required String label,
    required String sublabel,
    required TextEditingController controller,
    required String prefix,
    required ValueChanged<String> onChanged,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isDark ? Colors.grey[300] : const Color(0xFF1E293B),
              ),
            ),
            Text(
              sublabel,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          onChanged: onChanged,
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
          decoration: InputDecoration(
            prefixIcon: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
              child: Text(
                prefix,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF00D09C)),
              ),
            ),
            prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
            filled: true,
            fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF00D09C), width: 2),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTargetChip(CalculatorProvider p, double pct, String label, {bool isLoss = false}) {
    return InkWell(
      onTap: () => p.applyQuickTarget(pct),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
        decoration: BoxDecoration(
          color: isLoss
              ? const Color(0xFFEF4444).withOpacity(0.12)
              : const Color(0xFF00D09C).withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: isLoss ? const Color(0xFFEF4444) : const Color(0xFF00D09C),
          ),
        ),
      ),
    );
  }

  Widget _buildSmallNumberField(String label, int val, ValueChanged<int> onVal) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.grey)),
        const SizedBox(height: 4),
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.remove, size: 14),
              onPressed: () {
                if (val > 1) onVal(val - 1);
              },
              visualDensity: VisualDensity.compact,
            ),
            Text('$val', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
            IconButton(
              icon: const Icon(Icons.add, size: 14),
              onPressed: () => onVal(val + 1),
              visualDensity: VisualDensity.compact,
            ),
          ],
        ),
      ],
    );
  }
}
