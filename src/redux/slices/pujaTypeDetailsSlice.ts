import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getPujaTypeDetails} from '../../services/api';
import {PujaType} from '../../types/home';

export interface PujaTypeDetailsState {
  pujaTypeDetails: PujaType | null;
  loading: boolean;
  error: string | null;
}

const initialState: PujaTypeDetailsState = {
  pujaTypeDetails: null,
  loading: false,
  error: null,
};

// Async thunk for fetching puja type details
export const fetchPujaTypeDetails = createAsyncThunk(
  'pujaTypeDetails/fetchPujaTypeDetails',
  async (id: number, {rejectWithValue}) => {
    try {
      const data = await getPujaTypeDetails(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch puja type details',
      );
    }
  },
);

const pujaTypeDetailsSlice = createSlice({
  name: 'pujaTypeDetails',
  initialState,
  reducers: {
    clearPujaTypeDetails: state => {
      state.pujaTypeDetails = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPujaTypeDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPujaTypeDetails.fulfilled, (state, action: PayloadAction<PujaType>) => {
        state.loading = false;
        state.pujaTypeDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchPujaTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch puja type details';
      });
  },
});

export const {clearPujaTypeDetails} = pujaTypeDetailsSlice.actions;
export default pujaTypeDetailsSlice.reducer;
