import { useSelector, useDispatch } from 'react-redux';
import { setRates, setSelectedCurrency, setLoading, setError } from '../store/currencySlice';
import { fetchExchangeRates, convertAmount, getCurrencySymbol } from '../services/currencyService';

export const useCurrency = () => {
  const dispatch = useDispatch();
  const { selectedCurrency, rates, loading, error, lastUpdated } = useSelector(
    (state) => state.currency
  );

  const loadRates = async (baseCurrency = 'USD') => {
    try {
      dispatch(setLoading(true));
      const data = await fetchExchangeRates(baseCurrency);
      dispatch(setRates(data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const changeCurrency = async (currencyCode) => {
    dispatch(setSelectedCurrency(currencyCode));
    await loadRates(currencyCode);
  };

  const convert = (amount) => {
    return convertAmount(amount, 'USD', selectedCurrency, rates);
  };

  const format = (amount) => {
    const converted = convert(amount);
    const symbol = getCurrencySymbol(selectedCurrency);
    return `${symbol}${converted.toFixed(2)}`;
  };

  return {
    selectedCurrency,
    rates,
    loading,
    error,
    lastUpdated,
    loadRates,
    changeCurrency,
    format,
    convert,
  };
};
