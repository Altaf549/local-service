import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getServicemanDetails} from '../../services/api';

interface ServiceCategory {
  id: number;
  category_name: string;
}

interface Experience {
  id: number;
  title: string;
  description: string;
  years: number;
  company: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  achieved_date: string;
}

interface Service {
  id: number;
  service_id: number;
  service_name: string;
  category: ServiceCategory;
  duration: string;
  price: string;
  description: string;
  image: string;
}

interface ServicemanDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  mobile_number: string;
  category: ServiceCategory;
  experience: number;
  availability_status: string;
  government_id: string;
  address: string;
  profile_photo: string;
  id_proof_image: string;
  experiences: Experience[];
  achievements: Achievement[];
  services: Service[];
}

interface ServicemanDetailsState {
  servicemanDetails: ServicemanDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicemanDetailsState = {
  servicemanDetails: null,
  loading: false,
  error: null,
};

// Async thunk for fetching serviceman details
export const fetchServicemanDetails = createAsyncThunk(
  'servicemanDetails/fetchServicemanDetails',
  async (servicemanId: number, {rejectWithValue}) => {
    try {
      const data = await getServicemanDetails(servicemanId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch serviceman details');
    }
  },
);

const servicemanDetailsSlice = createSlice({
  name: 'servicemanDetails',
  initialState,
  reducers: {
    clearServicemanDetails: (state) => {
      state.servicemanDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicemanDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicemanDetails.fulfilled, (state, action: PayloadAction<ServicemanDetails>) => {
        state.loading = false;
        state.servicemanDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchServicemanDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearServicemanDetails} = servicemanDetailsSlice.actions;
export default servicemanDetailsSlice.reducer;
