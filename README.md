# BrokerLens 🔍🌱

**BrokerLens** is a modern, high-precision web application to calculate trading charges, statutory government taxes, and exact **Net Take-Home P&L** for Indian stock market trades based on **Groww's official pricing structure** ([groww.in/pricing](https://groww.in/pricing)) and inspired by Zerodha's brokerage calculator.

---

## ✨ Features

1. **Dual Input Modes**:
   - **Total Amounts Mode (Default)**: Enter Total Invested Amount (₹), Total Current / Sell Value (₹), and Number of Total Shares.
   - **Per Share Mode**: Enter Buy Price per share (₹), Sell Price per share (₹), and Quantity.

2. **Full Segment & Exchange Coverage**:
   - **Equity Delivery (CNC)**: ₹20 or 0.05% brokerage (whichever is lower), 0.1% STT on Buy & Sell, ₹15.93 DP charge on sell, 0.015% stamp duty on buy.
   - **Equity Intraday (MIS)**: ₹20 or 0.05% brokerage (whichever is lower), 0.025% STT on sell only, ₹0 DP charge, 0.003% stamp duty on buy.
   - **Equity Futures**: Flat ₹20 per order, 0.02% STT on sell, 0.002% stamp duty on buy.
   - **Equity Options**: Flat ₹20 per order, 0.125% STT on sell premium, 0.003% stamp duty on buy.
   - **Exchanges**: NSE & BSE with their exact respective exchange transaction charge rates.

3. **Itemized Charges Breakdown**:
   - Groww Brokerage Fee (Buy / Sell / Total)
   - Securities Transaction Tax (STT / CTT)
   - Exchange Turnover Charges (NSE / BSE)
   - DP Charges (CDSL ₹3.50 + Groww ₹10.00 + 18% GST = ₹15.93 per ISIN sold)
   - Goods & Services Tax (18% GST on taxable services)
   - SEBI Turnover Charges (₹10 / Crore)
   - State Stamp Duty (On Buy value)
   - IPFT Charges (NSE Investor Protection Fund)

4. **Interactive Financial Insights**:
   - **Net Take-Home P&L** & **Net Return on Investment (ROI %)**
   - **Points to Breakeven**: Price rise required per share to cover all taxes & broker charges
   - **Target / Reverse Calculator**: Enter your desired in-hand net profit (e.g. ₹10,000) and get the exact required selling price
   - **Multi-Stock Portfolio Calculator**: Calculate combined taxes and P&L across multiple stocks
   - **Side-by-Side Broker Comparison**: Compare Groww vs Zerodha vs Angel One vs Upstox
   - **Interactive Visual Charts**: SVG Donut chart for charge distribution and Gross vs Net profit bar
   - **Electronic Contract Note**: Simulated printable digital contract note

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

```bash
cd groww-calculator
npm install
npm run dev
```

Visit the app at `http://127.0.0.1:5173/` in your browser.

### Build for Production

```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.
