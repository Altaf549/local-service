import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getBrahmanExperiences as getBrahmanExperiencesApi,
  addBrahmanExperience as addBrahmanExperienceApi,
  updateBrahmanExperience as updateBrahmanExperienceApi,
  deleteBrahmanExperience as deleteBrahmanExperienceApi 
} from '../../services/api';

interface Experience {
  id: number;
  title: string;
  organization: string;
  description: string;
  years: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface BrahmanExperienceState {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  addLoading: boolean;
  addError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: BrahmanExperienceState = {
  experiences: [],
  loading: false,
  error: null,
  addLoading: false,
  addError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

// Async thunks
export const fetchBrahmanExperiences = createAsyncThunk(
  'brahmanExperience/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getBrahmanExperiencesApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch experiences');
    }
  }
);

export const addBrahmanExperience = createAsyncThunk(
  'brahmanExperience/addExperience',
  async (experienceData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await addBrahmanExperienceApi(experienceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add experience');
    }
  }
);

export const updateBrahmanExperience = createAsyncThunk(
  'brahmanExperience/updateExperience',
  async ({ id, experienceData }: { id: number; experienceData: Partial<Experience> }, { rejectWithValue }) => {
    try {
      const response = await updateBrahmanExperienceApi(id, experienceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update experience');
    }
  }
);

export const deleteBrahmanExperience = createAsyncThunk(
  'brahmanExperience/deleteExperience',
  async (experienceId: number, { rejectWithValue }) => {
    try {
      await deleteBrahmanExperienceApi(experienceId);
      return experienceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete experience');
    }
  }
);

const brahmanExperienceSlice = createSlice({
  name: 'brahmanExperience',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.addError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch experiences
      .addCase(fetchBrahmanExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrahmanExperiences.fulfilled, (state, action: PayloadAction<Experience[]>) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchBrahmanExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add experience
      .addCase(addBrahmanExperience.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addBrahmanExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.addLoading = false;
        state.experiences.push(action.payload);
      })
      .addCase(addBrahmanExperience.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload as string;
      })
      // Update experience
      .addCase(updateBrahmanExperience.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateBrahmanExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.updateLoading = false;
        const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(updateBrahmanExperience.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Delete experience
      .addCase(deleteBrahmanExperience.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteBrahmanExperience.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false;
        state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
      })
      .addCase(deleteBrahmanExperience.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearErrors } = brahmanExperienceSlice.actions;
export default brahmanExperienceSlice.reducer;
