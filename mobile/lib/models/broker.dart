class Broker {
  final String id;
  final String name;
  final String logo;
  final String deliveryText;
  final String intradayText;
  final String foText;
  final double dpBaseCharge;
  final double dpTotalWithGst;
  final double deliveryRate;
  final double deliveryMaxCap;
  final double intradayRate;
  final double intradayMaxCap;
  final double foRate;
  final String sebiRegNo;
  final String entityName;

  const Broker({
    required this.id,
    required this.name,
    required this.logo,
    required this.deliveryText,
    required this.intradayText,
    required this.foText,
    required this.dpBaseCharge,
    required this.dpTotalWithGst,
    required this.deliveryRate,
    required this.deliveryMaxCap,
    required this.intradayRate,
    required this.intradayMaxCap,
    required this.foRate,
    required this.sebiRegNo,
    required this.entityName,
  });

  static const List<Broker> defaultBrokers = [
    Broker(
      id: 'groww',
      name: 'Groww',
      logo: '🌱',
      deliveryText: '₹20 or 0.05% (whichever lower)',
      intradayText: '₹20 or 0.05% (whichever lower)',
      foText: 'Flat ₹20 / order',
      dpBaseCharge: 13.5,
      dpTotalWithGst: 15.93,
      deliveryRate: 0.0005,
      deliveryMaxCap: 20.0,
      intradayRate: 0.0005,
      intradayMaxCap: 20.0,
      foRate: 20.0,
      sebiRegNo: 'INZ000208032',
      entityName: 'Nextbillion Technology Pvt Ltd',
    ),
    Broker(
      id: 'zerodha',
      name: 'Zerodha',
      logo: '🪁',
      deliveryText: '₹0 (Free Equity Delivery)',
      intradayText: '₹20 or 0.03% (whichever lower)',
      foText: 'Flat ₹20 / order',
      dpBaseCharge: 13.5,
      dpTotalWithGst: 15.93,
      deliveryRate: 0.0,
      deliveryMaxCap: 0.0,
      intradayRate: 0.0003,
      intradayMaxCap: 20.0,
      foRate: 20.0,
      sebiRegNo: 'INZ000031633',
      entityName: 'Zerodha Broking Ltd',
    ),
    Broker(
      id: 'angelone',
      name: 'Angel One',
      logo: '👼',
      deliveryText: '₹20 or 0.1% (whichever lower)',
      intradayText: '₹20 or 0.25% (whichever lower)',
      foText: 'Flat ₹20 / order',
      dpBaseCharge: 20.0,
      dpTotalWithGst: 23.60,
      deliveryRate: 0.001,
      deliveryMaxCap: 20.0,
      intradayRate: 0.0025,
      intradayMaxCap: 20.0,
      foRate: 20.0,
      sebiRegNo: 'INZ000161534',
      entityName: 'Angel One Limited',
    ),
    Broker(
      id: 'upstox',
      name: 'Upstox',
      logo: '🚀',
      deliveryText: '₹20 or 2.5% (max ₹20)',
      intradayText: '₹20 or 0.05% (whichever lower)',
      foText: 'Flat ₹20 / order',
      dpBaseCharge: 18.5,
      dpTotalWithGst: 21.83,
      deliveryRate: 0.025,
      deliveryMaxCap: 20.0,
      intradayRate: 0.0005,
      intradayMaxCap: 20.0,
      foRate: 20.0,
      sebiRegNo: 'INZ000015837',
      entityName: 'RKSV Securities India Pvt Ltd',
    ),
    Broker(
      id: 'dhan',
      name: 'Dhan',
      logo: '⚡',
      deliveryText: '₹0 (Free Equity Delivery)',
      intradayText: '₹20 or 0.03% (whichever lower)',
      foText: 'Flat ₹20 / order',
      dpBaseCharge: 12.5,
      dpTotalWithGst: 14.75,
      deliveryRate: 0.0,
      deliveryMaxCap: 0.0,
      intradayRate: 0.0003,
      intradayMaxCap: 20.0,
      foRate: 20.0,
      sebiRegNo: 'INZ000006031',
      entityName: 'Moneylicious Securities Pvt Ltd',
    ),
    Broker(
      id: 'kotak',
      name: 'Kotak Neo',
      logo: '🏛️',
      deliveryText: '₹0 (Trade Free Plan)',
      intradayText: '₹0 (Trade Free Plan)',
      foText: 'Flat ₹20 / order',
      dpBaseCharge: 13.0,
      dpTotalWithGst: 15.34,
      deliveryRate: 0.0,
      deliveryMaxCap: 0.0,
      intradayRate: 0.0,
      intradayMaxCap: 0.0,
      foRate: 20.0,
      sebiRegNo: 'INZ000200137',
      entityName: 'Kotak Securities Limited',
    ),
  ];

  static Broker getById(String id) {
    return defaultBrokers.firstWhere(
      (b) => b.id == id,
      orElse: () => defaultBrokers.first,
    );
  }
}
