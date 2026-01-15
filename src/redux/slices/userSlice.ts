import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import { updateUserProfile } from '../../services/api';

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  profile_photo?: string;
  profile_photo_url?: string;
  address?: string;
  token?: string;
  role?: string;
  status?: string;
  availability_status?: string;
  [key: string]: any;
}

export interface UserState {
  userData: UserData | null;
  isUser: boolean;
  updateProfileLoading: boolean;
  updateProfileError: string | null;
}

const initialState: UserState = {
  userData: null,
  isUser: false,
  updateProfileLoading: false,
  updateProfileError: null,
};

// Async thunk for updating user profile
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: any, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(profileData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setIsUser: (state, action: PayloadAction<boolean>) => {
      state.isUser = action.payload;
    },
    clearUserData: state => {
      state.userData = null;
      state.isUser = false;
    },
    logoutUser: state => {
      state.userData = null;
      state.isUser = false;
    },
    clearUpdateProfileError: state => {
      state.updateProfileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = null;
        // Update user data with the response
        if (state.userData) {
          state.userData = { ...state.userData, ...action.payload };
        }
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = action.payload as string;
      });
  },
});

export const {setUserData, setIsUser, clearUserData, logoutUser, clearUpdateProfileError} = userSlice.actions;
export default userSlice.reducer;

