import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {userLogin, servicemanLogin, brahmanLogin, logout} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginCredentials {
  email: string;
  password: string;
  role: 'user' | 'serviceman' | 'brahman';
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      role: string;
      status: string;
    };
    serviceman?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      status: string;
      availability_status: string;
    };
    brahman?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      status: string;
      availability_status: string;
    };
    token: string;
  };
}

interface AuthState {
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  loginSuccess: false,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, {rejectWithValue}) => {
    try {
      let response: LoginResponse;
      
      switch (credentials.role) {
        case 'user':
          response = await userLogin(credentials.email, credentials.password);
          break;
        case 'serviceman':
          response = await servicemanLogin(credentials.email, credentials.password);
          break;
        case 'brahman':
          response = await brahmanLogin(credentials.email, credentials.password);
          break;
        default:
          throw new Error('Invalid user role');
      }

      if (response.success) {
        const userData = {
          id: response.data.user?.id || response.data.serviceman?.id || response.data.brahman?.id || 0,
          name: response.data.user?.name || response.data.serviceman?.name || response.data.brahman?.name || '',
          email: response.data.user?.email || response.data.serviceman?.email || response.data.brahman?.email || '',
          mobile_number: response.data.user?.mobile_number || response.data.serviceman?.mobile_number || response.data.brahman?.mobile_number || '',
          role: credentials.role,
          status: response.data.user?.status || response.data.serviceman?.status || response.data.brahman?.status,
          availability_status: response.data.serviceman?.availability_status || response.data.brahman?.availability_status,
          token: response.data.token,
        };

        // Store user data and token in AsyncStorage
        await AsyncStorage.setItem('user_token', response.data.token);
        await AsyncStorage.setItem('user_info', JSON.stringify(userData));

        return userData;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed';
        const errors = error.response.data?.errors;
        
        if (errors) {
          // Handle validation errors
          const validationErrors: string[] = [];
          if (errors.email) {
            validationErrors.push(errors.email[0]);
          }
          if (errors.password) {
            validationErrors.push(errors.password[0]);
          }
          return rejectWithValue(validationErrors.join(' ') || errorMessage);
        }
        
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      } else {
        return rejectWithValue('An unexpected error occurred.');
      }
    }
  },
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      const response = await logout();
      
      if (response.success) {
        // Clear AsyncStorage
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_info');
        
        return response.message;
      } else {
        return rejectWithValue(response.message || 'Logout failed');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Logout failed';
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      } else {
        return rejectWithValue('An unexpected error occurred.');
      }
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: state => {
      state.loading = false;
      state.error = null;
      state.loginSuccess = false;
    },
    clearLoginSuccess: state => {
      state.loginSuccess = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(loginUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.loginSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
        state.loginSuccess = false;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Logout failed';
      });
  },
});

export const {clearAuthState, clearLoginSuccess} = authSlice.actions;
export default authSlice.reducer;
