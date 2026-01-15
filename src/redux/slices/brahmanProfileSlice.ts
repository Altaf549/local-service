import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { getBrahmanProfileData, updateBrahmanProfile, getBrahmanStatus } from '../../services/api';

interface BrahmanProfileData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  government_id: string;
  address: string;
  profile_photo?: string;
  id_proof_image?: string;
  status?: string;
  availability_status?: string;
  is_active?: boolean;
  is_available?: boolean;
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

// Async thunk for getting brahman status
export const getBrahmanStatusThunk = createAsyncThunk(
  'brahmanProfile/getStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getBrahmanStatus(id);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get brahman status');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get brahman status');
    }
  }
);

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
    builder
      // Get brahman profile data
      .addCase(fetchBrahmanProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrahmanProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchBrahmanProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get brahman status
      .addCase(getBrahmanStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrahmanStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Update profile data with status information
        if (state.profileData && action.payload.data) {
          state.profileData = {
            ...state.profileData,
            is_active: action.payload.data.is_active,
            is_available: action.payload.data.is_available,
            status: action.payload.data.status,
            availability_status: action.payload.data.availability_status,
          };
        }
      })
      .addCase(getBrahmanStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update brahman profile
      .addCase(updateBrahmanProfileData.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateBrahmanProfileData.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        state.profileData = action.payload;
      })
      .addCase(updateBrahmanProfileData.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearBrahmanProfileError, clearBrahmanProfileData } = brahmanProfileSlice.actions;
export default brahmanProfileSlice.reducer;
