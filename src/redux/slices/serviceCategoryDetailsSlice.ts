import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getServiceCategoryDetails} from '../../services/api';
import {ServiceCategory} from '../../types/home';

export interface ServiceCategoryDetailsState {
  categoryDetails: ServiceCategory | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceCategoryDetailsState = {
  categoryDetails: null,
  loading: false,
  error: null,
};

// Async thunk for fetching service category details
export const fetchServiceCategoryDetails = createAsyncThunk(
  'serviceCategoryDetails/fetchServiceCategoryDetails',
  async (id: number, {rejectWithValue}) => {
    try {
      const data = await getServiceCategoryDetails(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch service category details',
      );
    }
  },
);

const serviceCategoryDetailsSlice = createSlice({
  name: 'serviceCategoryDetails',
  initialState,
  reducers: {
    clearServiceCategoryDetails: state => {
      state.categoryDetails = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServiceCategoryDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategoryDetails.fulfilled, (state, action: PayloadAction<ServiceCategory>) => {
        state.loading = false;
        state.categoryDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch service category details';
      });
  },
});

export const {clearServiceCategoryDetails} = serviceCategoryDetailsSlice.actions;
export default serviceCategoryDetailsSlice.reducer;
