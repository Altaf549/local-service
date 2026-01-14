import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {userLogin, servicemanLogin, brahmanLogin, logout, userRegister, servicemanRegister, brahmanRegister} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../network/axiosConfig';

interface LoginCredentials {
  email: string;
  password: string;
  role: 'user' | 'serviceman' | 'brahman';
}

interface RegisterCredentials {
  name: string;
  email: string;
  mobile_number: string;
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
      address?: string;
      profile_photo?: string;
      profile_photo_url?: string;
    };
    serviceman?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      status: string;
      availability_status: string;
      address?: string;
      profile_photo?: string;
      profile_photo_url?: string;
    };
    brahman?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      status: string;
      availability_status: string;
      address?: string;
      profile_photo?: string;
      profile_photo_url?: string;
    };
    token: string;
  };
}

interface RegisterResponse {
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
      address?: string;
      created_at: string;
    };
    serviceman?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      status: string;
      availability_status: string;
      address?: string;
      created_at: string;
    };
    brahman?: {
      id: number;
      name: string;
      email: string;
      mobile_number: string;
      status: string;
      availability_status: string;
      address?: string;
      created_at: string;
    };
    token?: string;
  };
}

interface AuthState {
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  loginSuccess: false,
  registerSuccess: false,
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
          profile_photo: response.data.user?.profile_photo || response.data.serviceman?.profile_photo || response.data.brahman?.profile_photo,
          profile_photo_url: response.data.user?.profile_photo_url || response.data.serviceman?.profile_photo_url || response.data.brahman?.profile_photo_url,
          address: response.data.user?.address || response.data.serviceman?.address || response.data.brahman?.address,
          role: credentials.role,
          status: response.data.user?.status || response.data.serviceman?.status || response.data.brahman?.status,
          availability_status: response.data.serviceman?.availability_status || response.data.brahman?.availability_status,
          token: response.data.token,
        };

        console.log('AuthSlice - Login successful with role:', credentials.role);
        console.log('AuthSlice - User data being stored:', userData);

        // Store user data and token in AsyncStorage
        await AsyncStorage.setItem('user_token', response.data.token);
        await AsyncStorage.setItem('user_info', JSON.stringify(userData));

        // Set authorization header for axios
        setAuthToken(response.data.token);

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
      // Always clear local data first
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_info');
      
      // Try to call logout API, but don't fail if it doesn't work
      try {
        const response = await logout();
        
        if (response.success) {
          return response.message;
        } else {
          // API call failed but local data is cleared, return success anyway
          return 'Logged out successfully';
        }
      } catch (apiError) {
        console.warn('Logout API call failed, but local data cleared:', apiError);
        // API call failed but local data is cleared, return success anyway
        return 'Logged out successfully';
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even if there's an error, try to clear local data
      try {
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_info');
      } catch (storageError) {
        console.error('Failed to clear AsyncStorage:', storageError);
      }
      
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

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterCredentials, {rejectWithValue}) => {
    try {
      let response: RegisterResponse;
      
      switch (credentials.role) {
        case 'user':
          response = await userRegister(credentials.name, credentials.email, credentials.mobile_number, credentials.password);
          break;
        case 'serviceman':
          response = await servicemanRegister(credentials.name, credentials.email, credentials.mobile_number, credentials.password);
          break;
        case 'brahman':
          response = await brahmanRegister(credentials.name, credentials.email, credentials.mobile_number, credentials.password);
          break;
        default:
          throw new Error('Invalid user role');
      }

      if (response.success) {
        // For user registration, we might get a token and can log them in immediately
        if (response.data.token && response.data.user) {
          const userData = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            mobile_number: response.data.user.mobile_number,
            address: response.data.user.address,
            role: credentials.role,
            status: response.data.user.status,
            token: response.data.token,
          };

          // Store user data and token in AsyncStorage
          await AsyncStorage.setItem('user_token', response.data.token);
          await AsyncStorage.setItem('user_info', JSON.stringify(userData));

          // Set authorization header for axios
          setAuthToken(response.data.token);

          return userData;
        } else {
          // For serviceman and brahman, registration succeeds but they need admin activation
          return {
            message: response.message,
            needsActivation: true,
            role: credentials.role,
          };
        }
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Registration failed';
        const errors = error.response.data?.errors;
        
        if (errors) {
          // Handle validation errors
          const validationErrors: string[] = [];
          if (errors.name) {
            validationErrors.push(errors.name[0]);
          }
          if (errors.email) {
            validationErrors.push(errors.email[0]);
          }
          if (errors.mobile_number) {
            validationErrors.push(errors.mobile_number[0]);
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: state => {
      state.loading = false;
      state.error = null;
      state.loginSuccess = false;
      state.registerSuccess = false;
    },
    clearLoginSuccess: state => {
      state.loginSuccess = false;
    },
    clearRegisterSuccess: state => {
      state.registerSuccess = false;
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
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Registration failed';
        state.registerSuccess = false;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.loginSuccess = false;
        state.registerSuccess = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Logout failed';
      });
  },
});

export const {clearAuthState, clearLoginSuccess, clearRegisterSuccess} = authSlice.actions;
export default authSlice.reducer;
