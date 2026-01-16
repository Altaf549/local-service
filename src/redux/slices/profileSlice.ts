import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  updateServicemanSimpleProfile,
  deleteServicemanAccount,
  updateBrahmanSimpleProfile,
  deleteBrahmanAccount,
  getServicemanProfileData,
  getBrahmanProfileData,
} from '../../services/api';
import { ImagePickerResult } from '../../utils/imagePicker';
import Console from '../../utils/Console';

// Types
export interface ProfileData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  profile_photo?: string;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ServicemanProfileUpdateData {
  current_password: string;
  name?: string;
  email?: string;
  mobile_number?: string;
  address?: string;
  new_password?: string;
  profile_photo?: ImagePickerResult;
}

export interface BrahmanProfileUpdateData {
  current_password: string;
  name?: string;
  email?: string;
  mobile_number?: string;
  address?: string;
  new_password?: string;
  profile_photo?: ImagePickerResult;
}

export interface ProfileState {
  // Serviceman Profile
  servicemanProfile: ProfileData | null;
  servicemanProfileLoading: boolean;
  servicemanProfileError: string | null;
  
  // Serviceman Profile Update
  servicemanUpdateLoading: boolean;
  servicemanUpdateError: string | null;
  servicemanUpdateSuccess: boolean;
  
  // Serviceman Account Delete
  servicemanDeleteLoading: boolean;
  servicemanDeleteError: string | null;
  servicemanDeleteSuccess: boolean;
  
  // Brahman Profile
  brahmanProfile: ProfileData | null;
  brahmanProfileLoading: boolean;
  brahmanProfileError: string | null;
  
  // Brahman Profile Update
  brahmanUpdateLoading: boolean;
  brahmanUpdateError: string | null;
  brahmanUpdateSuccess: boolean;
  
  // Brahman Account Delete
  brahmanDeleteLoading: boolean;
  brahmanDeleteError: string | null;
  brahmanDeleteSuccess: boolean;
}

const initialState: ProfileState = {
  // Serviceman Profile
  servicemanProfile: null,
  servicemanProfileLoading: false,
  servicemanProfileError: null,
  
  // Serviceman Profile Update
  servicemanUpdateLoading: false,
  servicemanUpdateError: null,
  servicemanUpdateSuccess: false,
  
  // Serviceman Account Delete
  servicemanDeleteLoading: false,
  servicemanDeleteError: null,
  servicemanDeleteSuccess: false,
  
  // Brahman Profile
  brahmanProfile: null,
  brahmanProfileLoading: false,
  brahmanProfileError: null,
  
  // Brahman Profile Update
  brahmanUpdateLoading: false,
  brahmanUpdateError: null,
  brahmanUpdateSuccess: false,
  
  // Brahman Account Delete
  brahmanDeleteLoading: false,
  brahmanDeleteError: null,
  brahmanDeleteSuccess: false,
};

// Serviceman Profile Thunks
export const fetchServicemanProfile = createAsyncThunk(
  'profile/fetchServicemanProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getServicemanProfileData();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch serviceman profile');
    } catch (error: any) {
      Console.error('Fetch serviceman profile error:', error);
      return rejectWithValue(error.message || 'Failed to fetch serviceman profile');
    }
  }
);

export const updateServicemanProfileThunk = createAsyncThunk(
  'profile/updateServicemanProfile',
  async (profileData: ServicemanProfileUpdateData, { rejectWithValue }) => {
    try {
      const response = await updateServicemanSimpleProfile(profileData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update serviceman profile');
    } catch (error: any) {
      Console.error('Update serviceman profile error:', error);
      
      // Extract structured error message if available
      let errorMessage = 'Failed to update serviceman profile';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors?.current_password?.[0]) {
          errorMessage = errorData.errors.current_password[0];
        } else if (errorData.errors?.email?.[0]) {
          errorMessage = errorData.errors.email[0];
        } else if (errorData.errors?.mobile_number?.[0]) {
          errorMessage = errorData.errors.mobile_number[0];
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteServicemanAccountThunk = createAsyncThunk(
  'profile/deleteServicemanAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteServicemanAccount();
      if (response.success) {
        return response.message;
      }
      throw new Error(response.message || 'Failed to delete serviceman account');
    } catch (error: any) {
      Console.error('Delete serviceman account error:', error);
      return rejectWithValue(error.message || 'Failed to delete serviceman account');
    }
  }
);

// Brahman Profile Thunks
export const fetchBrahmanProfile = createAsyncThunk(
  'profile/fetchBrahmanProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrahmanProfileData();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch brahman profile');
    } catch (error: any) {
      Console.error('Fetch brahman profile error:', error);
      return rejectWithValue(error.message || 'Failed to fetch brahman profile');
    }
  }
);

export const updateBrahmanProfileThunk = createAsyncThunk(
  'profile/updateBrahmanProfile',
  async (profileData: BrahmanProfileUpdateData, { rejectWithValue }) => {
    try {
      const response = await updateBrahmanSimpleProfile(profileData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update brahman profile');
    } catch (error: any) {
      Console.error('Update brahman profile error:', error);
      
      // Extract structured error message if available
      let errorMessage = 'Failed to update brahman profile';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors?.current_password?.[0]) {
          errorMessage = errorData.errors.current_password[0];
        } else if (errorData.errors?.email?.[0]) {
          errorMessage = errorData.errors.email[0];
        } else if (errorData.errors?.mobile_number?.[0]) {
          errorMessage = errorData.errors.mobile_number[0];
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      Console.log('Update brahman profile error message:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBrahmanAccountThunk = createAsyncThunk(
  'profile/deleteBrahmanAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteBrahmanAccount();
      if (response.success) {
        return response.message;
      }
      throw new Error(response.message || 'Failed to delete brahman account');
    } catch (error: any) {
      Console.error('Delete brahman account error:', error);
      return rejectWithValue(error.message || 'Failed to delete brahman account');
    }
  }
);

// Profile Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearServicemanUpdateState: (state) => {
      state.servicemanUpdateError = null;
      state.servicemanUpdateSuccess = false;
    },
    clearServicemanDeleteState: (state) => {
      state.servicemanDeleteError = null;
      state.servicemanDeleteSuccess = false;
    },
    clearBrahmanUpdateState: (state) => {
      state.brahmanUpdateError = null;
      state.brahmanUpdateSuccess = false;
    },
    clearBrahmanDeleteState: (state) => {
      state.brahmanDeleteError = null;
      state.brahmanDeleteSuccess = false;
    },
    clearProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    // Serviceman Profile Fetch
    builder
      .addCase(fetchServicemanProfile.pending, (state) => {
        state.servicemanProfileLoading = true;
        state.servicemanProfileError = null;
      })
      .addCase(fetchServicemanProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.servicemanProfileLoading = false;
        state.servicemanProfile = action.payload;
      })
      .addCase(fetchServicemanProfile.rejected, (state, action) => {
        state.servicemanProfileLoading = false;
        state.servicemanProfileError = action.payload as string;
      });

    // Serviceman Profile Update
    builder
      .addCase(updateServicemanProfileThunk.pending, (state) => {
        state.servicemanUpdateLoading = true;
        state.servicemanUpdateError = null;
        state.servicemanUpdateSuccess = false;
      })
      .addCase(updateServicemanProfileThunk.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.servicemanUpdateLoading = false;
        state.servicemanProfile = action.payload;
        state.servicemanUpdateSuccess = true;
      })
      .addCase(updateServicemanProfileThunk.rejected, (state, action) => {
        state.servicemanUpdateLoading = false;
        state.servicemanUpdateError = action.payload as string;
        state.servicemanUpdateSuccess = false;
      });

    // Serviceman Account Delete
    builder
      .addCase(deleteServicemanAccountThunk.pending, (state) => {
        state.servicemanDeleteLoading = true;
        state.servicemanDeleteError = null;
        state.servicemanDeleteSuccess = false;
      })
      .addCase(deleteServicemanAccountThunk.fulfilled, (state) => {
        state.servicemanDeleteLoading = false;
        state.servicemanDeleteSuccess = true;
        state.servicemanProfile = null;
      })
      .addCase(deleteServicemanAccountThunk.rejected, (state, action) => {
        state.servicemanDeleteLoading = false;
        state.servicemanDeleteError = action.payload as string;
        state.servicemanDeleteSuccess = false;
      });

    // Brahman Profile Fetch
    builder
      .addCase(fetchBrahmanProfile.pending, (state) => {
        state.brahmanProfileLoading = true;
        state.brahmanProfileError = null;
      })
      .addCase(fetchBrahmanProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.brahmanProfileLoading = false;
        state.brahmanProfile = action.payload;
      })
      .addCase(fetchBrahmanProfile.rejected, (state, action) => {
        state.brahmanProfileLoading = false;
        state.brahmanProfileError = action.payload as string;
      });

    // Brahman Profile Update
    builder
      .addCase(updateBrahmanProfileThunk.pending, (state) => {
        state.brahmanUpdateLoading = true;
        state.brahmanUpdateError = null;
        state.brahmanUpdateSuccess = false;
      })
      .addCase(updateBrahmanProfileThunk.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.brahmanUpdateLoading = false;
        state.brahmanProfile = action.payload;
        state.brahmanUpdateSuccess = true;
      })
      .addCase(updateBrahmanProfileThunk.rejected, (state, action) => {
        state.brahmanUpdateLoading = false;
        state.brahmanUpdateError = action.payload as string;
        state.brahmanUpdateSuccess = false;
      });

    // Brahman Account Delete
    builder
      .addCase(deleteBrahmanAccountThunk.pending, (state) => {
        state.brahmanDeleteLoading = true;
        state.brahmanDeleteError = null;
        state.brahmanDeleteSuccess = false;
      })
      .addCase(deleteBrahmanAccountThunk.fulfilled, (state) => {
        state.brahmanDeleteLoading = false;
        state.brahmanDeleteSuccess = true;
        state.brahmanProfile = null;
      })
      .addCase(deleteBrahmanAccountThunk.rejected, (state, action) => {
        state.brahmanDeleteLoading = false;
        state.brahmanDeleteError = action.payload as string;
        state.brahmanDeleteSuccess = false;
      });
  },
});

export const {
  clearServicemanUpdateState,
  clearServicemanDeleteState,
  clearBrahmanUpdateState,
  clearBrahmanDeleteState,
  clearProfileState,
} = profileSlice.actions;

export default profileSlice.reducer;
