import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createServiceBooking, createPujaBooking, getUserBookings, getAllBookings, getBookingDetails, updateBooking, cancelBooking, acceptBooking, completeBooking } from '../../services/api';
import Console from '../../utils/Console';

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
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
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
  updateLoading: boolean;
  updateError: string | null;
  cancelLoading: boolean;
  cancelError: string | null;
  acceptLoading: boolean;
  acceptError: string | null;
  completeLoading: boolean;
  completeError: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  createBookingLoading: false,
  createBookingSuccess: false,
  updateLoading: false,
  updateError: null,
  cancelLoading: false,
  cancelError: null,
  acceptLoading: false,
  acceptError: null,
  completeLoading: false,
  completeError: null,
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
        // Handle structured error responses
        let errorMessage = response.message || 'Failed to create service booking';
        
        console.log('Service booking creation failed:', response);
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.log('Service booking creation error:', error);
      
      // Handle different error structures
      let errorMessage = 'An error occurred while creating service booking';
      
      if (error.response?.data?.errors?.service_id) {
        errorMessage = error.response.data.errors.service_id[0];
      } else if (error.response?.data?.errors?.serviceman_id) {
        errorMessage = error.response.data.errors.serviceman_id[0];
      } else if (error.response?.data?.errors?.booking_date) {
        errorMessage = error.response.data.errors.booking_date[0];
      } else if (error.response?.data?.errors?.booking_time) {
        errorMessage = error.response.data.errors.booking_time[0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
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
        // Handle structured error responses
        let errorMessage = response.message || 'Failed to create puja booking';
        
        console.log('Puja booking creation failed:', response);
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.log('Puja booking creation error:', error);
      
      // Handle different error structures
      let errorMessage = 'An error occurred while creating puja booking';
      
      if (error.response?.data?.errors?.puja_id) {
        errorMessage = error.response.data.errors.puja_id[0];
      } else if (error.response?.data?.errors?.brahman_id) {
        errorMessage = error.response.data.errors.brahman_id[0];
      } else if (error.response?.data?.errors?.booking_date) {
        errorMessage = error.response.data.errors.booking_date[0];
      } else if (error.response?.data?.errors?.booking_time) {
        errorMessage = error.response.data.errors.booking_time[0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
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

// Async thunk for fetching all bookings (admin/serviceman/brahman)
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBookings();
      if (response.success) {
        return response.data.bookings;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch all bookings');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching all bookings');
    }
  }
);

// Async thunk for fetching booking details
export const fetchBookingDetails = createAsyncThunk(
  'bookings/fetchBookingDetails',
  async (bookingId: number, { rejectWithValue }) => {
    try {
      Console.log("Fetching booking details for ID:", bookingId);
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

// Async thunk for updating booking
export const updateBookingThunk = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }: { id: number; bookingData: {
    booking_date?: string;
    booking_time?: string;
    address?: string;
    mobile_number?: string;
    notes?: string;
    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  }}, { rejectWithValue }) => {
    try {
      const response = await updateBooking(id, bookingData);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to update booking');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update booking');
    }
  }
);

// Async thunk for cancelling booking
export const cancelBookingThunk = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, cancellationReason }: { id: number; cancellationReason?: string }, { rejectWithValue }) => {
    try {
      const response = await cancelBooking(id, cancellationReason);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to cancel booking');
    }
  }
);

// Async thunk for accepting booking
export const acceptBookingThunk = createAsyncThunk(
  'bookings/acceptBooking',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await acceptBooking(id);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to accept booking');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to accept booking');
    }
  }
);

// Async thunk for completing booking
export const completeBookingThunk = createAsyncThunk(
  'bookings/completeBooking',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await completeBooking(id);
      if (response.success) {
        return response.data.booking;
      } else {
        return rejectWithValue(response.message || 'Failed to complete booking');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to complete booking');
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
      state.updateError = null;
      state.cancelError = null;
      state.acceptError = null;
      state.completeError = null;
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
        // Don't reset error here to prevent race conditions
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
        // Don't reset error here to prevent race conditions
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
      
      // Fetch all bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
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
      })
      
      // Update booking
      .addCase(updateBookingThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateBookingThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        // Update booking in the list
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current booking if it's the same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updateBookingThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      
      // Cancel booking
      .addCase(cancelBookingThunk.pending, (state) => {
        state.cancelLoading = true;
        state.cancelError = null;
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.cancelError = null;
        // Update booking in the list
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current booking if it's the same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancelError = action.payload as string;
      })
      
      // Accept booking
      .addCase(acceptBookingThunk.pending, (state) => {
        state.acceptLoading = true;
        state.acceptError = null;
      })
      .addCase(acceptBookingThunk.fulfilled, (state, action) => {
        state.acceptLoading = false;
        state.acceptError = null;
        // Update booking in the list
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current booking if it's the same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(acceptBookingThunk.rejected, (state, action) => {
        state.acceptLoading = false;
        state.acceptError = action.payload as string;
      })
      
      // Complete booking
      .addCase(completeBookingThunk.pending, (state) => {
        state.completeLoading = true;
        state.completeError = null;
      })
      .addCase(completeBookingThunk.fulfilled, (state, action) => {
        state.completeLoading = false;
        state.completeError = null;
        // Update booking in the list
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current booking if it's the same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(completeBookingThunk.rejected, (state, action) => {
        state.completeLoading = false;
        state.completeError = action.payload as string;
      });
  },
});

export const { clearBookingState, clearCreateBookingSuccess, setCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

export type { Booking };
