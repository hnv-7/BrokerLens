import 'dart:math';
import 'package:flutter/material.dart';
import '../models/trade_calculation.dart';
import '../services/calculator_service.dart';

class ChargesPieChart extends StatelessWidget {
  final TradeCalculationResult result;

  const ChargesPieChart({Key? key, required this.result}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final b = result.breakdown;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final slices = [
      _PieSlice('Brokerage', b.brokerage.total, const Color(0xFF00D09C)),
      _PieSlice('STT', b.stt.total, const Color(0xFF3B82F6)),
      _PieSlice('Exchange', b.exchangeTxn.total, const Color(0xFF8B5CF6)),
      _PieSlice('DP Charges', b.dpCharges.total, const Color(0xFFEC4899)),
      _PieSlice('GST', b.gst.total, const Color(0xFFF59E0B)),
      _PieSlice('Stamp Duty', b.stampDuty.total, const Color(0xFF14B8A6)),
      _PieSlice('SEBI + IPFT', b.sebiCharges.total + b.ipft.total, const Color(0xFF64748B)),
    ].where((s) => s.value > 0).toList();

    final total = slices.fold<double>(0.0, (acc, s) => acc + s.value);

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
          const Row(
            children: [
              Icon(Icons.pie_chart_outline, size: 18, color: Color(0xFF00D09C)),
              SizedBox(width: 6),
              Text(
                'Charges & Tax Distribution',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              // Custom Donut Painter
              SizedBox(
                width: 130,
                height: 130,
                child: CustomPaint(
                  painter: _DonutChartPainter(slices: slices, total: total, isDark: isDark),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'TOTAL',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: Colors.grey[400],
                          ),
                        ),
                        Text(
                          CalculatorService.formatINR(result.totalCharges),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Legend
              Expanded(
                child: Column(
                  children: slices.map((s) {
                    final pct = total > 0 ? (s.value / total) * 100 : 0.0;
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2.5),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: s.color,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              s.label,
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ),
                          Text(
                            '${pct.toStringAsFixed(1)}%',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PieSlice {
  final String label;
  final double value;
  final Color color;
  _PieSlice(this.label, this.value, this.color);
}

class _DonutChartPainter extends CustomPainter {
  final List<_PieSlice> slices;
  final double total;
  final bool isDark;

  _DonutChartPainter({
    required this.slices,
    required this.total,
    required this.isDark,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width / 2, size.height / 2) - 8;
    const strokeWidth = 14.0;

    final bgPaint = Paint()
      ..color = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(center, radius, bgPaint);

    if (total <= 0) return;

    double startAngle = -pi / 2;
    for (final slice in slices) {
      final sweepAngle = (slice.value / total) * 2 * pi;
      final slicePaint = Paint()
        ..color = slice.color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.butt;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        false,
        slicePaint,
      );
      startAngle += sweepAngle;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
