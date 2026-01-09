import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getServiceDetails} from '../../services/api';
import {ServiceWithServicemen} from '../../types/home';

export interface ServiceDetailsState {
  serviceDetails: ServiceWithServicemen | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceDetailsState = {
  serviceDetails: null,
  loading: false,
  error: null,
};

// Async thunk for fetching service details
export const fetchServiceDetails = createAsyncThunk(
  'serviceDetails/fetchServiceDetails',
  async (id: number, {rejectWithValue}) => {
    try {
      const data = await getServiceDetails(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch service details',
      );
    }
  },
);

const serviceDetailsSlice = createSlice({
  name: 'serviceDetails',
  initialState,
  reducers: {
    clearServiceDetails: state => {
      state.serviceDetails = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServiceDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceDetails.fulfilled, (state, action: PayloadAction<ServiceWithServicemen>) => {
        state.loading = false;
        state.serviceDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch service details';
      });
  },
});

export const {clearServiceDetails} = serviceDetailsSlice.actions;
export default serviceDetailsSlice.reducer;
