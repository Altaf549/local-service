import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getPujaDetails} from '../../services/api';

interface PujaType {
  id: number;
  type_name: string;
}

interface Brahman {
  id: number;
  name: string;
  specialization: string;
  languages: string;
  experience: number;
  charges: string;
  profile_photo: string;
  availability_status: string;
  phone?: string;
  price: string;
  custom_price: boolean;
  material_file?: string;
}

interface PujaDetails {
  id: number;
  puja_name: string;
  puja_type: PujaType;
  duration: string;
  price: string;
  description: string;
  image: string;
  material_file?: string;
  status: string;
  brahmans: Brahman[];
}

interface PujaDetailsState {
  pujaDetails: PujaDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: PujaDetailsState = {
  pujaDetails: null,
  loading: false,
  error: null,
};

// Async thunk for fetching puja details
export const fetchPujaDetails = createAsyncThunk(
  'pujaDetails/fetchPujaDetails',
  async (pujaId: number, {rejectWithValue}) => {
    try {
      const data = await getPujaDetails(pujaId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch puja details');
    }
  },
);

const pujaDetailsSlice = createSlice({
  name: 'pujaDetails',
  initialState,
  reducers: {
    clearPujaDetails: (state) => {
      state.pujaDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPujaDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPujaDetails.fulfilled, (state, action: PayloadAction<PujaDetails>) => {
        state.loading = false;
        state.pujaDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchPujaDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearPujaDetails} = pujaDetailsSlice.actions;
export default pujaDetailsSlice.reducer;
