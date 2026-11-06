import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/calculator_provider.dart';

class FaqScreen extends StatelessWidget {
  const FaqScreen({Key? key}) : super(key: key);

  static final Uri _releasesUrl =
      Uri.parse('https://github.com/hnv-7/BrokerLens/releases/latest');

  Future<void> _openReleases(BuildContext context) async {
    final messenger = ScaffoldMessenger.of(context);
    final opened = await launchUrl(_releasesUrl, mode: LaunchMode.externalApplication);
    if (!opened) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Could not open the releases page.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CalculatorProvider>();
    final broker = provider.selectedBroker;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final faqs = [
      {
        'q': 'How does ${broker.name} calculate brokerage?',
        'a': 'For Equity Delivery, ${broker.name} charges ${broker.deliveryText}. For Equity Intraday, it charges ${broker.intradayText}. For Futures & Options, it charges ${broker.foText}.',
      },
      {
        'q': 'What are DP (Depository Participant) Charges?',
        'a': 'For ${broker.name}, DP charge is ₹${broker.dpBaseCharge.toStringAsFixed(2)} + 18% GST (total ₹${broker.dpTotalWithGst.toStringAsFixed(2)}) debited from your Demat account per ISIN/company sold on equity delivery per day. DP charges do NOT apply on Intraday or F&O trades.',
      },
      {
        'q': 'How is STT (Securities Transaction Tax) calculated?',
        'a': 'STT is a statutory tax levied by the Government of India. For Delivery trades, STT is 0.1% on both Buy and Sell turnover. For Intraday, it is 0.025% on the Sell turnover only.',
      },
      {
        'q': 'What is State Stamp Duty?',
        'a': 'Stamp Duty is levied by state governments under the Indian Stamp Act on the BUY side turnover only (0.015% for Delivery, 0.003% for Intraday).',
      },
      {
        'q': 'How is GST calculated on stock trades?',
        'a': 'GST is 18% applied only on taxable services: (Brokerage + Exchange Txn Charges + SEBI Charges + DP Base Charge). STT and Stamp Duty are exempt from GST.',
      },
      {
        'q': 'What is Breakeven Selling Price?',
        'a': 'Breakeven is the exact price per share you must sell at so your Net P&L is exactly ₹0.00 after paying all ${broker.name} brokerage fees, STT, Exchange charges, GST, SEBI charges, Stamp duty, and DP charges.',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pricing & Taxes FAQ'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const Icon(Icons.school_outlined, color: Color(0xFF00D09C)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Indian Stock Market Statutory Rules & ${broker.name} Pricing Explained',
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          ...faqs.map((f) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: ExpansionTile(
                title: Text(
                  f['q']!,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                    child: Text(
                      f['a']!,
                      style: TextStyle(fontSize: 12, height: 1.5, color: isDark ? Colors.grey[300] : Colors.grey[700]),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
          const SizedBox(height: 4),

          // Check for updates
          Card(
            child: ListTile(
              leading: const Icon(Icons.system_update_alt, color: Color(0xFF00D09C)),
              title: const Text(
                'Check for updates',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
              ),
              subtitle: const Text(
                'Open the latest release on GitHub',
                style: TextStyle(fontSize: 11),
              ),
              trailing: const Icon(Icons.open_in_new, size: 18),
              onTap: () => _openReleases(context),
            ),
          ),
        ],
      ),
    );
  }
}
