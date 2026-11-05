import 'package:flutter/material.dart';
import '../models/trade_calculation.dart';
import '../services/calculator_service.dart';

class PnLSummaryCard extends StatelessWidget {
  final TradeCalculationResult result;

  const PnLSummaryCard({Key? key, required this.result}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isProfit = result.netPnL > 0;
    final isLoss = result.netPnL < 0;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final primaryColor = isProfit
        ? const Color(0xFF10B981)
        : isLoss
            ? const Color(0xFFEF4444)
            : const Color(0xFF64748B);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: primaryColor.withOpacity(0.35),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: primaryColor.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    isProfit
                        ? Icons.trending_up
                        : isLoss
                            ? Icons.trending_down
                            : Icons.remove,
                    color: primaryColor,
                    size: 18,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'NET TAKE-HOME P&L',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  isProfit
                      ? '+${result.netROI.toStringAsFixed(2)}% ROI'
                      : '${result.netROI.toStringAsFixed(2)}% ROI',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: primaryColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            CalculatorService.formatINR(result.netPnL),
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              letterSpacing: -1.0,
              color: primaryColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Actual take-home returns after ${result.broker.name} fees, DP, STT, and taxes.',
            style: TextStyle(
              fontSize: 11,
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
          ),
          const SizedBox(height: 16),
          const Divider(height: 1),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _buildMetric(
                  context,
                  'Gross Profit',
                  CalculatorService.formatINR(result.grossPnL),
                  result.grossPnL >= 0 ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                ),
              ),
              Container(width: 1, height: 32, color: Colors.grey.withOpacity(0.2)),
              Expanded(
                child: _buildMetric(
                  context,
                  'Total Taxes & Fees',
                  CalculatorService.formatINR(result.totalCharges),
                  const Color(0xFFF59E0B),
                ),
              ),
              Container(width: 1, height: 32, color: Colors.grey.withOpacity(0.2)),
              Expanded(
                child: _buildMetric(
                  context,
                  'Breakeven Price',
                  CalculatorService.formatINR(result.breakevenPrice),
                  isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(BuildContext context, String label, String value, Color valueColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: Color(0xFF94A3B8),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}
