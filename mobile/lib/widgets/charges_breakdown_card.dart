import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/trade_calculation.dart';
import '../services/calculator_service.dart';

class ChargesBreakdownCard extends StatelessWidget {
  final TradeCalculationResult result;

  const ChargesBreakdownCard({Key? key, required this.result}) : super(key: key);

  void _copySummary(BuildContext context) {
    final text = '''
${result.broker.name} Charges & Taxes Summary:
• Buy Turnover: ${CalculatorService.formatINR(result.buyTurnover)}
• Sell Turnover: ${CalculatorService.formatINR(result.sellTurnover)}
• Brokerage: ${CalculatorService.formatINR(result.breakdown.brokerage.total)}
• STT: ${CalculatorService.formatINR(result.breakdown.stt.total)}
• Exchange Txn: ${CalculatorService.formatINR(result.breakdown.exchangeTxn.total)}
• DP Charges: ${CalculatorService.formatINR(result.breakdown.dpCharges.total)}
• GST (18%): ${CalculatorService.formatINR(result.breakdown.gst.total)}
• Stamp Duty: ${CalculatorService.formatINR(result.breakdown.stampDuty.total)}
• SEBI + IPFT: ${CalculatorService.formatINR(result.breakdown.sebiCharges.total + result.breakdown.ipft.total)}
------------------------------------
Total Deductions: ${CalculatorService.formatINR(result.totalCharges)}
Net P&L: ${CalculatorService.formatINR(result.netPnL)}
''';
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Charges summary copied to clipboard!'),
        duration: Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final b = result.breakdown;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final rows = [
      _ChargeRow(
        title: '${result.broker.name} Brokerage',
        desc: b.brokerage.description,
        buy: b.brokerage.buy,
        sell: b.brokerage.sell,
        total: b.brokerage.total,
        tag: 'Broker Fee',
        tagColor: const Color(0xFF00D09C),
      ),
      _ChargeRow(
        title: 'STT / CTT',
        desc: b.stt.description,
        buy: b.stt.buy,
        sell: b.stt.sell,
        total: b.stt.total,
        tag: 'Govt Tax',
        tagColor: const Color(0xFF3B82F6),
      ),
      _ChargeRow(
        title: 'Exchange Txn Charge',
        desc: b.exchangeTxn.description,
        buy: b.exchangeTxn.buy,
        sell: b.exchangeTxn.sell,
        total: b.exchangeTxn.total,
        tag: result.exchange.name.toUpperCase(),
        tagColor: const Color(0xFF8B5CF6),
      ),
      _ChargeRow(
        title: 'DP Charges',
        desc: b.dpCharges.description,
        buy: 0.0,
        sell: b.dpCharges.total,
        total: b.dpCharges.total,
        tag: 'CDSL / Demat',
        tagColor: const Color(0xFFEC4899),
      ),
      _ChargeRow(
        title: 'GST (18%)',
        desc: b.gst.description,
        buy: b.gst.buy,
        sell: b.gst.sell,
        total: b.gst.total,
        tag: 'Govt Tax',
        tagColor: const Color(0xFFF59E0B),
      ),
      _ChargeRow(
        title: 'Stamp Duty',
        desc: b.stampDuty.description,
        buy: b.stampDuty.total,
        sell: 0.0,
        total: b.stampDuty.total,
        tag: 'State Govt',
        tagColor: const Color(0xFF14B8A6),
      ),
      _ChargeRow(
        title: 'SEBI Charges',
        desc: b.sebiCharges.description,
        buy: b.sebiCharges.buy,
        sell: b.sebiCharges.sell,
        total: b.sebiCharges.total,
        tag: 'Regulator',
        tagColor: const Color(0xFF64748B),
      ),
      _ChargeRow(
        title: 'IPFT',
        desc: b.ipft.description,
        buy: b.ipft.buy,
        sell: b.ipft.sell,
        total: b.ipft.total,
        tag: 'Investor Fund',
        tagColor: const Color(0xFF6366F1),
      ),
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.receipt_long, size: 18, color: Color(0xFF00D09C)),
                  SizedBox(width: 6),
                  Text(
                    'Itemized Taxes & Charges',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.copy, size: 16),
                onPressed: () => _copySummary(context),
                tooltip: 'Copy Breakdown',
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...rows.map((row) => _buildRowWidget(row, isDark)).toList(),
          const Divider(height: 24, thickness: 1.5),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total Taxes & ${result.broker.name} Fees',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
              ),
              Text(
                CalculatorService.formatINR(result.totalCharges),
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF00D09C),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRowWidget(_ChargeRow row, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      row.title,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                      decoration: BoxDecoration(
                        color: row.tagColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        row.tag,
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: row.tagColor,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  row.desc,
                  style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                ),
              ],
            ),
          ),
          Text(
            CalculatorService.formatINR(row.total),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              fontFamily: 'monospace',
              color: isDark ? Colors.grey[200] : const Color(0xFF0F172A),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChargeRow {
  final String title;
  final String desc;
  final double buy;
  final double sell;
  final double total;
  final String tag;
  final Color tagColor;

  _ChargeRow({
    required this.title,
    required this.desc,
    required this.buy,
    required this.sell,
    required this.total,
    required this.tag,
    required this.tagColor,
  });
}
