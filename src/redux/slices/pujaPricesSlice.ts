import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getAllPujaPrices, addPujaPrice as addPujaPriceApi, updatePujaPrice, deletePujaPrice} from '../../services/api';
import {PujaPrice} from '../../components/PriceCard/PriceCard';

// Puja Prices State
interface PujaPricesState {
  pujaPrices: PujaPrice[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialPujaPricesState: PujaPricesState = {
  pujaPrices: [],
  loading: false,
  error: null,
  refreshing: false,
};

// Async thunk for fetching puja prices
export const fetchPujaPrices = createAsyncThunk(
  'pujaPrices/fetchPujaPrices',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getAllPujaPrices();
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch puja prices';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for adding/updating puja price
export const addPujaPriceThunk = createAsyncThunk(
  'pujaPrices/addPujaPrice',
  async ({pujaId, price, materialFile}: {pujaId: number; price: string; materialFile?: any}, {rejectWithValue}) => {
    try {
      const response = await addPujaPriceApi(pujaId, price, materialFile);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add puja price';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating existing puja price
export const updatePujaPriceThunk = createAsyncThunk(
  'pujaPrices/updatePujaPrice',
  async ({pujaId, price, materialFile}: {pujaId: number; price: string; materialFile?: any}, {rejectWithValue}) => {
    try {
      const response = await updatePujaPrice(pujaId, price, materialFile);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update puja price';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting puja price
export const deletePujaPriceThunk = createAsyncThunk(
  'pujaPrices/deletePujaPrice',
  async ({pujaId}: {pujaId: number}, {rejectWithValue}) => {
    try {
      const response = await deletePujaPrice(pujaId);
      return {pujaId, response};
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete puja price';
      return rejectWithValue(errorMessage);
    }
  }
);

// Puja Prices Slice
const pujaPricesSlice = createSlice({
  name: 'pujaPrices',
  initialState: initialPujaPricesState,
  reducers: {
    clearPujaPricesError: state => {
      state.error = null;
    },
    clearPujaPrices: state => {
      state.pujaPrices = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPujaPrices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPujaPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.pujaPrices = action.payload;
      })
      .addCase(fetchPujaPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPujaPriceThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPujaPriceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally refresh the list after adding
        // This could be optimized to add the item directly to the array
      })
      .addCase(addPujaPriceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePujaPriceThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePujaPriceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the item in the array if needed
        const updatedItem = action.payload.data;
        if (updatedItem) {
          const index = state.pujaPrices.findIndex(item => item.puja_id === updatedItem.puja_id);
          if (index !== -1) {
            state.pujaPrices[index] = updatedItem;
          }
        }
      })
      .addCase(updatePujaPriceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePujaPriceThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePujaPriceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove the item from the array
        const {pujaId} = action.payload;
        state.pujaPrices = state.pujaPrices.filter(item => item.puja_id !== pujaId);
      })
      .addCase(deletePujaPriceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearPujaPricesError, clearPujaPrices} = pujaPricesSlice.actions;
export default pujaPricesSlice.reducer;
