import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getServiceCategories} from '../../services/api';
import {ServiceCategory} from '../../types/home';

export interface ServiceCategoryState {
  categories: ServiceCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk for fetching service categories
export const fetchServiceCategories = createAsyncThunk(
  'serviceCategory/fetchServiceCategories',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getServiceCategories();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch service categories',
      );
    }
  },
);

const serviceCategorySlice = createSlice({
  name: 'serviceCategory',
  initialState,
  reducers: {
    clearServiceCategories: state => {
      state.categories = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServiceCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action: PayloadAction<ServiceCategory[]>) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch service categories';
      });
  },
});

export const {clearServiceCategories} = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;
