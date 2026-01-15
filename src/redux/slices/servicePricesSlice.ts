import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getAllServicePrices} from '../../services/api';
import {ServicePrice} from '../../components/PriceCard/PriceCard';

// Service Prices State
interface ServicePricesState {
  servicePrices: ServicePrice[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialServicePricesState: ServicePricesState = {
  servicePrices: [],
  loading: false,
  error: null,
  refreshing: false,
};

// Async thunk for fetching service prices
export const fetchServicePrices = createAsyncThunk(
  'servicePrices/fetchServicePrices',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getAllServicePrices();
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch service prices';
      return rejectWithValue(errorMessage);
    }
  }
);

// Service Prices Slice
const servicePricesSlice = createSlice({
  name: 'servicePrices',
  initialState: initialServicePricesState,
  reducers: {
    clearServicePricesError: state => {
      state.error = null;
    },
    clearServicePrices: state => {
      state.servicePrices = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServicePrices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicePrices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.servicePrices = action.payload;
      })
      .addCase(fetchServicePrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearServicePricesError, clearServicePrices} = servicePricesSlice.actions;
export default servicePricesSlice.reducer;
