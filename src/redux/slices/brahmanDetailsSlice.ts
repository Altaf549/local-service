import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getBrahmanDetails} from '../../services/api';

interface PujaService {
  id: number;
  puja_id: number;
  puja_name: string;
  puja_type: string;
  duration: string;
  price: string;
  description: string;
  material_file: string;
  image: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  achieved_date: string;
}

interface Experience {
  id: number;
  title: string;
  description: string;
  years: number;
  organization: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

interface BrahmanDetails {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  specialization: string;
  languages: string;
  experience: number;
  charges: string;
  availability_status: string;
  government_id: string;
  address: string;
  profile_photo: string;
  id_proof_image: string;
  experiences: Experience[];
  achievements: Achievement[];
  services: PujaService[];
}

interface BrahmanDetailsState {
  brahmanDetails: BrahmanDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: BrahmanDetailsState = {
  brahmanDetails: null,
  loading: false,
  error: null,
};

// Async thunk for fetching brahman details
export const fetchBrahmanDetails = createAsyncThunk(
  'brahmanDetails/fetchBrahmanDetails',
  async (brahmanId: number, {rejectWithValue}) => {
    try {
      const data = await getBrahmanDetails(brahmanId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch brahman details');
    }
  },
);

const brahmanDetailsSlice = createSlice({
  name: 'brahmanDetails',
  initialState,
  reducers: {
    clearBrahmanDetails: (state) => {
      state.brahmanDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrahmanDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrahmanDetails.fulfilled, (state, action: PayloadAction<BrahmanDetails>) => {
        state.loading = false;
        state.brahmanDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchBrahmanDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearBrahmanDetails} = brahmanDetailsSlice.actions;
export default brahmanDetailsSlice.reducer;
