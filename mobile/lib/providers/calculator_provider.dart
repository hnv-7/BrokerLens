import 'package:flutter/material.dart';
import '../models/broker.dart';
import '../models/portfolio_item.dart';
import '../models/stock_preset.dart';
import '../models/trade_calculation.dart';
import '../services/calculator_service.dart';

enum InputMode { totalAmount, perSharePrice }

class CalculatorProvider extends ChangeNotifier {
  Broker _selectedBroker = Broker.defaultBrokers[0]; // Groww default
  InputMode _inputMode = InputMode.totalAmount;
  TradeSegment _segment = TradeSegment.delivery;
  StockExchange _exchange = StockExchange.nse;

  double _investedAmount = 3851.0;
  double _currentTotalValue = 4268.0;
  double _buyPrice = 962.75;
  double _sellPrice = 1067.00;
  int _quantity = 4;

  int _buyOrdersCount = 1;
  int _sellOrdersCount = 1;
  int _isinCount = 1;

  bool _isDarkMode = false;

  final List<PortfolioItem> _portfolio = [
    PortfolioItem(
      id: '1',
      stockName: 'Reliance Industries',
      brokerId: 'groww',
      buyPrice: 2850,
      sellPrice: 3050,
      quantity: 50,
    ),
    PortfolioItem(
      id: '2',
      stockName: 'Tata Motors',
      brokerId: 'groww',
      buyPrice: 880,
      sellPrice: 960,
      quantity: 100,
    ),
    PortfolioItem(
      id: '3',
      stockName: 'Zomato',
      brokerId: 'groww',
      buyPrice: 210,
      sellPrice: 265,
      quantity: 400,
    ),
  ];

  // Getters
  Broker get selectedBroker => _selectedBroker;
  InputMode get inputMode => _inputMode;
  TradeSegment get segment => _segment;
  StockExchange get exchange => _exchange;
  double get investedAmount => _investedAmount;
  double get currentTotalValue => _currentTotalValue;
  double get buyPrice => _buyPrice;
  double get sellPrice => _sellPrice;
  int get quantity => _quantity;
  int get buyOrdersCount => _buyOrdersCount;
  int get sellOrdersCount => _sellOrdersCount;
  int get isinCount => _isinCount;
  bool get isDarkMode => _isDarkMode;
  List<PortfolioItem> get portfolio => _portfolio;

  double get effectiveBuyPrice => _inputMode == InputMode.totalAmount && _quantity > 0
      ? _investedAmount / _quantity
      : _buyPrice;

  double get effectiveSellPrice => _inputMode == InputMode.totalAmount && _quantity > 0
      ? _currentTotalValue / _quantity
      : _sellPrice;

  TradeCalculationResult get currentResult => CalculatorService.calculate(
        buyPrice: effectiveBuyPrice,
        sellPrice: effectiveSellPrice,
        quantity: _quantity,
        broker: _selectedBroker,
        segment: _segment,
        exchange: _exchange,
        buyOrdersCount: _buyOrdersCount,
        sellOrdersCount: _sellOrdersCount,
        isinCount: _isinCount,
      );

  // Setters & Actions
  void setBroker(Broker broker) {
    _selectedBroker = broker;
    notifyListeners();
  }

  void setInputMode(InputMode mode) {
    _inputMode = mode;
    notifyListeners();
  }

  void setSegment(TradeSegment seg) {
    _segment = seg;
    notifyListeners();
  }

  void setExchange(StockExchange ex) {
    _exchange = ex;
    notifyListeners();
  }

  void setInvestedAmount(double val) {
    _investedAmount = val;
    if (_quantity > 0) {
      _buyPrice = double.parse((val / _quantity).toStringAsFixed(2));
    }
    notifyListeners();
  }

  void setCurrentTotalValue(double val) {
    _currentTotalValue = val;
    if (_quantity > 0) {
      _sellPrice = double.parse((val / _quantity).toStringAsFixed(2));
    }
    notifyListeners();
  }

  void setBuyPrice(double val) {
    _buyPrice = val;
    _investedAmount = double.parse((val * _quantity).toStringAsFixed(2));
    notifyListeners();
  }

  void setSellPrice(double val) {
    _sellPrice = val;
    _currentTotalValue = double.parse((val * _quantity).toStringAsFixed(2));
    notifyListeners();
  }

  void setQuantity(int qty) {
    _quantity = qty;
    if (_inputMode == InputMode.totalAmount) {
      if (qty > 0) {
        _buyPrice = double.parse((_investedAmount / qty).toStringAsFixed(2));
        _sellPrice = double.parse((_currentTotalValue / qty).toStringAsFixed(2));
      }
    } else {
      _investedAmount = double.parse((_buyPrice * qty).toStringAsFixed(2));
      _currentTotalValue = double.parse((_sellPrice * qty).toStringAsFixed(2));
    }
    notifyListeners();
  }

  void setBuyOrdersCount(int count) {
    _buyOrdersCount = count;
    notifyListeners();
  }

  void setSellOrdersCount(int count) {
    _sellOrdersCount = count;
    notifyListeners();
  }

  void setIsinCount(int count) {
    _isinCount = count;
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  void applyPreset(StockPreset p) {
    _buyPrice = p.buyPrice;
    _sellPrice = p.sellPrice;
    _quantity = p.qty;
    _investedAmount = p.buyPrice * p.qty;
    _currentTotalValue = p.sellPrice * p.qty;
    _segment = p.segment;
    _exchange = p.exchange;
    notifyListeners();
  }

  void applyQuickTarget(double percentage) {
    final currentInvested = _inputMode == InputMode.totalAmount
        ? _investedAmount
        : _buyPrice * _quantity;

    if (currentInvested > 0) {
      final newTotalValue = double.parse((currentInvested * (1 + percentage / 100)).toStringAsFixed(2));
      _currentTotalValue = newTotalValue;
      if (_quantity > 0) {
        _sellPrice = double.parse((newTotalValue / _quantity).toStringAsFixed(2));
      }
      notifyListeners();
    }
  }

  void reset() {
    _selectedBroker = Broker.defaultBrokers[0];
    _inputMode = InputMode.totalAmount;
    _segment = TradeSegment.delivery;
    _exchange = StockExchange.nse;
    _investedAmount = 3851.0;
    _currentTotalValue = 4268.0;
    _buyPrice = 962.75;
    _sellPrice = 1067.00;
    _quantity = 4;
    _buyOrdersCount = 1;
    _sellOrdersCount = 1;
    _isinCount = 1;
    notifyListeners();
  }

  // Portfolio Operations
  void addPortfolioItem(PortfolioItem item) {
    _portfolio.add(item);
    notifyListeners();
  }

  void removePortfolioItem(String id) {
    _portfolio.removeWhere((item) => item.id == id);
    notifyListeners();
  }
}
