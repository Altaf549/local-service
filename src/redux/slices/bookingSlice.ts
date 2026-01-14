import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createServiceBooking, createPujaBooking, getUserBookings, getBookingDetails } from '../../services/api';

interface Booking {
  id: number;
  user_id: number;
  booking_type: 'service' | 'puja';
  service_id?: number;
  puja_id?: number;
  serviceman_id?: number;
  brahman_id?: number;
  booking_date: string;
  booking_time: string;
  address: string;
  mobile_number: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string;
  total_amount: string;
  created_at: string;
  updated_at: string;
  user?: any;
  service?: any;
  puja?: any;
  serviceman?: any;
  brahman?: any;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  createBookingLoading: boolean;
  createBookingSuccess: boolean;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  createBookingLoading: false,
  createBookingSuccess: false,
};

// Async thunk for creating service booking
export const createServiceBookingThunk = createAsyncThunk(
  'bookings/createServiceBooking',
  async (bookingData: {
    service_id: number;
    serviceman_id: number;
    booking_date: string;
    booking_time: string;
    address: string;
    mobile_number: string;
    notes?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await createServiceBooking(bookingData);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to create service booking');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while creating service booking');
    }
  }
);

// Async thunk for creating puja booking
export const createPujaBookingThunk = createAsyncThunk(
  'bookings/createPujaBooking',
  async (bookingData: {
    puja_id: number;
    brahman_id: number;
    booking_date: string;
    booking_time: string;
    address: string;
    mobile_number: string;
    notes?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await createPujaBooking(bookingData);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to create puja booking');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while creating puja booking');
    }
  }
);

// Async thunk for fetching user bookings
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserBookings();
      if (response.success) {
        return response.data.bookings;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching bookings');
    }
  }
);

// Async thunk for fetching booking details
export const fetchBookingDetails = createAsyncThunk(
  'bookings/fetchBookingDetails',
  async (bookingId: number, { rejectWithValue }) => {
    try {
      const response = await getBookingDetails(bookingId);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch booking details');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching booking details');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookingState: (state) => {
      state.createBookingLoading = false;
      state.createBookingSuccess = false;
      state.error = null;
    },
    clearCreateBookingSuccess: (state) => {
      state.createBookingSuccess = false;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create service booking
      .addCase(createServiceBookingThunk.pending, (state) => {
        state.createBookingLoading = true;
        state.createBookingSuccess = false;
        state.error = null;
      })
      .addCase(createServiceBookingThunk.fulfilled, (state, action) => {
        state.createBookingLoading = false;
        state.createBookingSuccess = true;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createServiceBookingThunk.rejected, (state, action) => {
        state.createBookingLoading = false;
        state.createBookingSuccess = false;
        state.error = action.payload as string;
      })
      
      // Create puja booking
      .addCase(createPujaBookingThunk.pending, (state) => {
        state.createBookingLoading = true;
        state.createBookingSuccess = false;
        state.error = null;
      })
      .addCase(createPujaBookingThunk.fulfilled, (state, action) => {
        state.createBookingLoading = false;
        state.createBookingSuccess = true;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createPujaBookingThunk.rejected, (state, action) => {
        state.createBookingLoading = false;
        state.createBookingSuccess = false;
        state.error = action.payload as string;
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch booking details
      .addCase(fetchBookingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookingState, clearCreateBookingSuccess, setCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

export type { Booking };
