import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getBrahmans} from '../../services/api';
import {Brahman} from '../../types/home';

export interface BrahmanState {
  brahmans: Brahman[];
  loading: boolean;
  error: string | null;
}

const initialState: BrahmanState = {
  brahmans: [],
  loading: false,
  error: null,
};

// Async thunk for fetching brahmans
export const fetchBrahmans = createAsyncThunk(
  'brahman/fetchBrahmans',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getBrahmans();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch brahmans',
      );
    }
  },
);

const brahmanSlice = createSlice({
  name: 'brahman',
  initialState,
  reducers: {
    clearBrahmans: state => {
      state.brahmans = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBrahmans.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrahmans.fulfilled, (state, action: PayloadAction<Brahman[]>) => {
        state.loading = false;
        state.brahmans = action.payload;
        state.error = null;
      })
      .addCase(fetchBrahmans.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch brahmans';
      });
  },
});

export const {clearBrahmans} = brahmanSlice.actions;
export default brahmanSlice.reducer;
