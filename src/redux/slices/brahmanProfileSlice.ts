import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBrahmanProfileData, updateBrahmanProfile } from '../../services/api';

interface BrahmanProfileData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  government_id: string;
  address: string;
  profile_photo?: string;
  id_proof_image?: string;
}

interface BrahmanProfileState {
  profileData: BrahmanProfileData | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

const initialState: BrahmanProfileState = {
  profileData: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

// Async thunk for getting brahman profile data
export const fetchBrahmanProfileData = createAsyncThunk(
  'brahmanProfile/fetchProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrahmanProfileData();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile data');
    }
  }
);

// Async thunk for updating brahman profile
export const updateBrahmanProfileData = createAsyncThunk(
  'brahmanProfile/updateProfileData',
  async (profileData: {
    government_id: string;
    id_proof_image?: any;
    address: string;
    profile_photo?: any;
  }, { rejectWithValue }) => {
    try {
      const response = await updateBrahmanProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const brahmanProfileSlice = createSlice({
  name: 'brahmanProfile',
  initialState,
  reducers: {
    clearBrahmanProfileError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearBrahmanProfileData: (state) => {
      state.profileData = null;
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile data
    builder
      .addCase(fetchBrahmanProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrahmanProfileData.fulfilled, (state, action: PayloadAction<BrahmanProfileData>) => {
        state.loading = false;
        state.profileData = action.payload;
        state.error = null;
      })
      .addCase(fetchBrahmanProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile data
    builder
      .addCase(updateBrahmanProfileData.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateBrahmanProfileData.fulfilled, (state, action: PayloadAction<BrahmanProfileData>) => {
        state.updateLoading = false;
        state.profileData = action.payload;
        state.updateError = null;
      })
      .addCase(updateBrahmanProfileData.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearBrahmanProfileError, clearBrahmanProfileData } = brahmanProfileSlice.actions;
export default brahmanProfileSlice.reducer;
