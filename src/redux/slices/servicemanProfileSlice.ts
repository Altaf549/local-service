import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { getServicemanProfileData, updateServicemanProfile, getServicemanStatus } from '../../services/api';

interface ServicemanProfileData {
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

interface ServicemanProfileState {
  profileData: ServicemanProfileData | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

const initialState: ServicemanProfileState = {
  profileData: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

// Async thunk for getting serviceman status
export const getServicemanStatusThunk = createAsyncThunk(
  'servicemanProfile/getStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getServicemanStatus(id);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get serviceman status');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get serviceman status');
    }
  }
);

// Async thunk for getting serviceman profile data
export const fetchServicemanProfileData = createAsyncThunk(
  'servicemanProfile/fetchProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getServicemanProfileData();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile data');
    }
  }
);

// Async thunk for updating serviceman profile
export const updateServicemanProfileData = createAsyncThunk(
  'servicemanProfile/updateProfileData',
  async (profileData: {
    government_id: string;
    id_proof_image?: any;
    address: string;
    profile_photo?: any;
  }, { rejectWithValue }) => {
    try {
      const response = await updateServicemanProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const servicemanProfileSlice = createSlice({
  name: 'servicemanProfile',
  initialState,
  reducers: {
    clearServicemanProfileError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearServicemanProfileData: (state) => {
      state.profileData = null;
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get serviceman profile data
      .addCase(fetchServicemanProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicemanProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchServicemanProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get serviceman status
      .addCase(getServicemanStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicemanStatusThunk.fulfilled, (state, action) => {
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
      .addCase(getServicemanStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update serviceman profile
      .addCase(updateServicemanProfileData.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateServicemanProfileData.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        state.profileData = action.payload;
      })
      .addCase(updateServicemanProfileData.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearServicemanProfileError, clearServicemanProfileData } = servicemanProfileSlice.actions;
export default servicemanProfileSlice.reducer;
