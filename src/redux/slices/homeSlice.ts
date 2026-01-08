import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getHomeData} from '../../services/api';
import {
  HomeData,
  Banner,
  ServiceCategory,
  Service,
  Serviceman,
  PujaType,
  Puja,
  Brahman,
} from '../../types/home';

export interface HomeState {
  banners: Banner[];
  service_categories: ServiceCategory[];
  services: Service[];
  servicemen: Serviceman[];
  puja_types: PujaType[];
  pujas: Puja[];
  brahmans: Brahman[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  banners: [],
  service_categories: [],
  services: [],
  servicemen: [],
  puja_types: [],
  pujas: [],
  brahmans: [],
  loading: false,
  error: null,
};

// Async thunk for fetching home data
export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (_, {rejectWithValue}) => {
    try {
      const data = await getHomeData();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch home data',
      );
    }
  },
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeData: state => {
      state.banners = [];
      state.service_categories = [];
      state.services = [];
      state.servicemen = [];
      state.puja_types = [];
      state.pujas = [];
      state.brahmans = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHomeData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action: PayloadAction<HomeData>) => {
        state.loading = false;
        state.banners = action.payload.banners || [];
        state.service_categories = action.payload.service_categories || [];
        state.services = action.payload.services || [];
        state.servicemen = action.payload.servicemen || [];
        state.puja_types = action.payload.puja_types || [];
        state.pujas = action.payload.pujas || [];
        state.brahmans = action.payload.brahmans || [];
        state.error = null;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch home data';
      });
  },
});

export const {clearHomeData} = homeSlice.actions;
export default homeSlice.reducer;

