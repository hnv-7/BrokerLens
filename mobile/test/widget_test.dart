import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:brokerlens_mobile/main.dart';
import 'package:brokerlens_mobile/providers/calculator_provider.dart';

void main() {
  testWidgets('BrokerLens smoke test - loads home screen tabs', (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => CalculatorProvider()),
        ],
        child: const BrokerLensApp(),
      ),
    );
    await tester.pumpAndSettle();

    // Verify key UI elements
    expect(find.byType(RichText), findsWidgets);
    expect(find.text('Groww Edition Calculator'), findsOneWidget);
    expect(find.text('NET TAKE-HOME P&L'), findsOneWidget);
    expect(find.text('Calculator'), findsOneWidget);
  });
}
