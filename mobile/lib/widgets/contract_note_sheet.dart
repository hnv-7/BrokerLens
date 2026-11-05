import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../models/trade_calculation.dart';
import '../services/calculator_service.dart';

class ContractNoteSheet extends StatelessWidget {
  final TradeCalculationResult result;

  const ContractNoteSheet({Key? key, required this.result}) : super(key: key);

  static void show(BuildContext context, TradeCalculationResult result) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ContractNoteSheet(result: result),
    );
  }

  void _shareNote() {
    final date = DateFormat('dd MMM yyyy').format(DateTime.now());
    final text = '''
====================================
SIMULATED ELECTRONIC CONTRACT NOTE
====================================
Broker: ${result.broker.name} (${result.broker.entityName})
SEBI Reg: ${result.broker.sebiRegNo}
Trade Date: $date
Exchange: ${result.exchange.name.toUpperCase()} (${result.segment.name.toUpperCase()})

Trade Details:
• Quantity: ${result.quantity} shares
• Buy Price: ${CalculatorService.formatINR(result.buyPrice)}
• Sell Price: ${CalculatorService.formatINR(result.sellPrice)}
• Total Turnover: ${CalculatorService.formatINR(result.totalTurnover)}

Deductions:
• Brokerage: ${CalculatorService.formatINR(result.breakdown.brokerage.total)}
• STT: ${CalculatorService.formatINR(result.breakdown.stt.total)}
• Exchange Txn: ${CalculatorService.formatINR(result.breakdown.exchangeTxn.total)}
• DP Charges: ${CalculatorService.formatINR(result.breakdown.dpCharges.total)}
• GST: ${CalculatorService.formatINR(result.breakdown.gst.total)}
• Stamp Duty: ${CalculatorService.formatINR(result.breakdown.stampDuty.total)}
• SEBI + IPFT: ${CalculatorService.formatINR(result.breakdown.sebiCharges.total + result.breakdown.ipft.total)}
------------------------------------
TOTAL DEDUCTIONS: ${CalculatorService.formatINR(result.totalCharges)}
NET TAKE-HOME: ${CalculatorService.formatINR(result.netPnL)} (${result.netROI >= 0 ? '+' : ''}${result.netROI.toStringAsFixed(2)}%)
====================================
Generated via BrokerLens Mobile App
''';
    Share.share(text);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final date = DateFormat('dd MMM yyyy').format(DateTime.now());

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[400],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 12),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.description_outlined, color: Color(0xFF00D09C)),
                    const SizedBox(width: 8),
                    Text(
                      'Electronic Contract Note',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(),

          // Body Content
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
              children: [
                // Broker & Reg Info
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${result.broker.logo} ${result.broker.name.toUpperCase()}',
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            result.broker.entityName,
                            style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                          ),
                          Text(
                            'SEBI Reg: ${result.broker.sebiRegNo}',
                            style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text('TRADE DATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.grey)),
                          Text(date, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                          const SizedBox(height: 4),
                          Text(
                            '${result.exchange.name.toUpperCase()} • ${result.segment.name.toUpperCase()}',
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF00D09C)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Trade Summary Chips
                Row(
                  children: [
                    Expanded(child: _buildInfoBox('Quantity', '${result.quantity} shares', isDark)),
                    const SizedBox(width: 8),
                    Expanded(child: _buildInfoBox('Buy Price', CalculatorService.formatINR(result.buyPrice), isDark)),
                    const SizedBox(width: 8),
                    Expanded(child: _buildInfoBox('Sell Price', CalculatorService.formatINR(result.sellPrice), isDark)),
                  ],
                ),
                const SizedBox(height: 14),

                // Table of charges
                const Text('Statutory & Broker Deductions', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                const SizedBox(height: 8),
                _buildNoteRow('${result.broker.name} Brokerage', result.breakdown.brokerage.total),
                _buildNoteRow('Securities Transaction Tax (STT)', result.breakdown.stt.total),
                _buildNoteRow('Exchange Transaction Charges', result.breakdown.exchangeTxn.total),
                _buildNoteRow('DP Charges (Demat Debit)', result.breakdown.dpCharges.total),
                _buildNoteRow('Goods and Services Tax (18% GST)', result.breakdown.gst.total),
                _buildNoteRow('SEBI Turnover Charges', result.breakdown.sebiCharges.total),
                _buildNoteRow('State Stamp Duty', result.breakdown.stampDuty.total),
                const Divider(height: 16),
                _buildNoteRow('Total Taxes & Charges', result.totalCharges, isBold: true, color: const Color(0xFFF59E0B)),
                const SizedBox(height: 14),

                // Net in-hand result
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00D09C).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF00D09C).withOpacity(0.3)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('NET IN-HAND PROFIT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF00D09C))),
                          Text(
                            CalculatorService.formatINR(result.netPnL),
                            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF00D09C)),
                          ),
                        ],
                      ),
                      Text(
                        '${result.netROI >= 0 ? '+' : ''}${result.netROI.toStringAsFixed(2)}% ROI',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF00D09C)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Bottom Action
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _shareNote,
                icon: const Icon(Icons.share, size: 18),
                label: const Text('Share Contract Note', style: TextStyle(fontWeight: FontWeight.w800)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00D09C),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoBox(String title, String val, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 10),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.grey)),
          const SizedBox(height: 2),
          Text(val, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }

  Widget _buildNoteRow(String title, double amount, {bool isBold = false, Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isBold ? FontWeight.w800 : FontWeight.w500,
            ),
          ),
          Text(
            CalculatorService.formatINR(amount),
            style: TextStyle(
              fontSize: 11,
              fontWeight: isBold ? FontWeight.w900 : FontWeight.w700,
              fontFamily: 'monospace',
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
