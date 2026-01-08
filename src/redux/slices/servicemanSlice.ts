import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getServicemen} from '../../services/api';
import {Serviceman} from '../../types/home';

export interface ServicemanState {
  servicemen: Serviceman[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicemanState = {
  servicemen: [],
  loading: false,
  error: null,
};

// Async thunk for fetching servicemen
export const fetchServicemen = createAsyncThunk(
  'serviceman/fetchServicemen',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getServicemen();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch servicemen',
      );
    }
  },
);

const servicemanSlice = createSlice({
  name: 'serviceman',
  initialState,
  reducers: {
    clearServicemen: state => {
      state.servicemen = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServicemen.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicemen.fulfilled, (state, action: PayloadAction<Serviceman[]>) => {
        state.loading = false;
        state.servicemen = action.payload;
        state.error = null;
      })
      .addCase(fetchServicemen.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch servicemen';
      });
  },
});

export const {clearServicemen} = servicemanSlice.actions;
export default servicemanSlice.reducer;
