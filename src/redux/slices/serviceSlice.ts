import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getServices} from '../../services/api';
import {Service} from '../../types/home';

export interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

// Async thunk for fetching services
export const fetchServices = createAsyncThunk(
  'service/fetchServices',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getServices();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch services',
      );
    }
  },
);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    clearServices: state => {
      state.services = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch services';
      });
  },
});

export const {clearServices} = serviceSlice.actions;
export default serviceSlice.reducer;
