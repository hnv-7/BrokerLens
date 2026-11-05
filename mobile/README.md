# BrokerLens Mobile 📱

**BrokerLens Mobile** is a native cross-platform (Flutter for iOS & Android) stock brokerage, statutory taxes, and true net P&L calculator specifically built for Indian stock market investors and traders.

Supports **Groww (Default)**, **Zerodha**, **Angel One**, **Upstox**, **Dhan**, and **Kotak Neo**.

---

## ✨ Features

- **Accurate Statutory & Brokerage Engine**:
  - Brokerage (Groww ₹20 or 0.05% max, Zerodha ₹0 Delivery, etc.)
  - STT / CTT (0.1% Delivery, 0.025% Intraday)
  - DP Charges (₹13.50 + 18% GST = ₹15.93 per ISIN sold)
  - Exchange Txn Fees (NSE 0.00297%, BSE 0.00375%)
  - GST 18% on Services
  - State Stamp Duty (0.015% on BUY side)
  - SEBI Turnover Charges & NSE IPFT
- **Dual Input Modes**:
  - **Total Amounts Mode**: Total Invested (₹) + Quantity + Current Value (₹)
  - **Per Share Price Mode**: Buy Price (₹) + Quantity + Sell Price (₹)
- **Quick Gain Target Chips**: Instant +2%, +5%, +10%, +20%, +50%, 2x 100%, -5% Stop Loss.
- **Visual Charges Donut Chart**: Built using Flutter `CustomPainter`.
- **Target / Reverse Calculator**: Find exact required selling price for a target take-home profit.
- **Multi-Stock Portfolio Calculator**: Aggregated taxes, DP debits, and portfolio net ROI across multiple holdings.
- **Broker Comparison Matrix**: Compare total deductions and net take-home profit across all 6 discount brokers side-by-side.
- **Simulated Electronic Contract Note**: Formatted contract note with sharing support.
- **Material 3 Design & Dark Mode**: Seamless theme switching with persistent state.

---

## 📂 Project Architecture

```
brokerlens_mobile/
├── pubspec.yaml                 # Dependencies and assets
├── test/
│   └── calculator_test.dart     # Calculation engine unit test suite
└── lib/
    ├── main.dart                # App entrypoint & bottom navigation
    ├── theme/
    │   └── app_theme.dart       # Material 3 light & dark theme palettes
    ├── models/
    │   ├── broker.dart          # Broker configurations (Groww, Zerodha, etc.)
    │   ├── trade_calculation.dart # Calculation data structures & breakdowns
    │   ├── stock_preset.dart    # Quick preset ideas (Reliance, Tata Motors, etc.)
    │   └── portfolio_item.dart  # Multi-stock portfolio holding model
    ├── services/
    │   └── calculator_service.dart # Core math & statutory tax calculation engine
    ├── providers/
    │   └── calculator_provider.dart # State management (Provider pattern)
    ├── screens/
    │   ├── home_screen.dart     # Main single trade calculator
    │   ├── target_reverse_screen.dart # Target profit solver screen
    │   ├── portfolio_screen.dart # Multi-stock basket & portfolio screen
    │   ├── broker_compare_screen.dart # Broker charges comparison screen
    │   └── faq_screen.dart      # Rules & tax guide FAQ
    └── widgets/
        ├── broker_selector_bar.dart # Active broker horizontal selector
        ├── pnl_summary_card.dart # Net take-home P&L card
        ├── calculator_input_form.dart # Dual mode inputs & segment controls
        ├── charges_breakdown_card.dart # Itemized deductions table
        ├── charges_pie_chart.dart # Donut distribution chart
        └── contract_note_sheet.dart # Modal contract note sheet
```

---

## 🚀 How to Run the App

### Prerequisites
- Install [Flutter SDK](https://docs.flutter.dev/get-started/install) (version 3.0+)
- Android Studio / Xcode for simulators or connected devices.

### Steps
1. Navigate to the mobile app folder:
   ```bash
   cd brokerlens_mobile
   ```

2. Fetch Flutter dependencies:
   ```bash
   flutter pub get
   ```

3. Run the automated unit tests:
   ```bash
   flutter test
   ```

4. Launch the application:
   ```bash
   # Run on connected phone or active simulator
   flutter run

   # Or build Android APK
   flutter build apk --release

   # Or build iOS IPA / Runner
   flutter build ios --release
   ```
