import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { deleteAccount } from '../../services/api';

interface DeleteAccountState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DeleteAccountState = {
  loading: false,
  error: null,
  success: false,
};

// Async thunk for deleting user account
export const deleteUserAccount = createAsyncThunk(
  'deleteAccount/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteAccount();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to delete account');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to delete account';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const deleteAccountSlice = createSlice({
  name: 'deleteAccount',
  initialState,
  reducers: {
    clearDeleteAccountError: (state) => {
      state.error = null;
    },
    clearDeleteAccountSuccess: (state) => {
      state.success = false;
    },
    resetDeleteAccountState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { 
  clearDeleteAccountError, 
  clearDeleteAccountSuccess, 
  resetDeleteAccountState 
} = deleteAccountSlice.actions;

export default deleteAccountSlice.reducer;
