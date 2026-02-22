const BASE_URL = 'https://open.er-api.com/v6/latest';

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`${BASE_URL}/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error('Failed to fetch exchange rates');
    }

    return {
      rates: data.rates,
      lastUpdated: data.time_last_update_utc,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch exchange rates');
  }
};

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
];

export const convertAmount = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates || fromCurrency === toCurrency) return amount;
  const inUSD = amount / (rates[fromCurrency] || 1);
  return inUSD * (rates[toCurrency] || 1);
};

export const getCurrencySymbol = (code) => {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return currency ? currency.symbol : '$';
};
