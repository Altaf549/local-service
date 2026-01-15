import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getAllServicePrices, addServicePrice} from '../../services/api';
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

// Async thunk for adding/updating service price
export const addServicePriceThunk = createAsyncThunk(
  'servicePrices/addServicePrice',
  async ({serviceId, price}: {serviceId: number; price: string}, {rejectWithValue}) => {
    try {
      const response = await addServicePrice(serviceId, price);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add service price';
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
      })
      .addCase(addServicePriceThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServicePriceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally refresh the list after adding
        // This could be optimized to add the item directly to the array
      })
      .addCase(addServicePriceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearServicePricesError, clearServicePrices} = servicePricesSlice.actions;
export default servicePricesSlice.reducer;
