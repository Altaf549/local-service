import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getPujas} from '../../services/api';
import {Puja} from '../../types/home';

export interface PujaState {
  pujas: Puja[];
  loading: boolean;
  error: string | null;
}

const initialState: PujaState = {
  pujas: [],
  loading: false,
  error: null,
};

// Async thunk for fetching pujas
export const fetchPujas = createAsyncThunk(
  'puja/fetchPujas',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getPujas();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch pujas',
      );
    }
  },
);

const pujaSlice = createSlice({
  name: 'puja',
  initialState,
  reducers: {
    clearPujas: state => {
      state.pujas = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPujas.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPujas.fulfilled, (state, action: PayloadAction<Puja[]>) => {
        state.loading = false;
        state.pujas = action.payload;
        state.error = null;
      })
      .addCase(fetchPujas.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch pujas';
      });
  },
});

export const {clearPujas} = pujaSlice.actions;
export default pujaSlice.reducer;
