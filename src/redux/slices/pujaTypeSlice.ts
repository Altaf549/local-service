import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getPujaTypes} from '../../services/api';
import {PujaType} from '../../types/home';

export interface PujaTypeState {
  pujaTypes: PujaType[];
  loading: boolean;
  error: string | null;
}

const initialState: PujaTypeState = {
  pujaTypes: [],
  loading: false,
  error: null,
};

// Async thunk for fetching puja types
export const fetchPujaTypes = createAsyncThunk(
  'pujaType/fetchPujaTypes',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getPujaTypes();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch puja types',
      );
    }
  },
);

const pujaTypeSlice = createSlice({
  name: 'pujaType',
  initialState,
  reducers: {
    clearPujaTypes: state => {
      state.pujaTypes = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPujaTypes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPujaTypes.fulfilled, (state, action: PayloadAction<PujaType[]>) => {
        state.loading = false;
        state.pujaTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchPujaTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch puja types';
      });
  },
});

export const {clearPujaTypes} = pujaTypeSlice.actions;
export default pujaTypeSlice.reducer;
