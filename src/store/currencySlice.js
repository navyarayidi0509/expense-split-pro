import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  baseCurrency: 'USD',
  selectedCurrency: 'USD',
  rates: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setRates(state, action) {
      state.rates = action.payload.rates;
      state.lastUpdated = action.payload.lastUpdated;
      state.loading = false;
      state.error = null;
    },
    setSelectedCurrency(state, action) {
      state.selectedCurrency = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setRates, setSelectedCurrency, setLoading, setError } = currencySlice.actions;

export default currencySlice.reducer;
