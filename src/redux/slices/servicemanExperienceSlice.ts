import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getServicemanExperiences as getServicemanExperiencesApi,
  addServicemanExperience as addServicemanExperienceApi,
  updateServicemanExperience as updateServicemanExperienceApi,
  deleteServicemanExperience as deleteServicemanExperienceApi 
} from '../../services/api';

interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  years: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface ServicemanExperienceState {
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

const initialState: ServicemanExperienceState = {
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
export const fetchServicemanExperiences = createAsyncThunk(
  'servicemanExperience/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getServicemanExperiencesApi();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch experiences');
    }
  }
);

export const addServicemanExperience = createAsyncThunk(
  'servicemanExperience/addExperience',
  async (experienceData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await addServicemanExperienceApi(experienceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add experience');
    }
  }
);

export const updateServicemanExperience = createAsyncThunk(
  'servicemanExperience/updateExperience',
  async ({ id, experienceData }: { id: number; experienceData: Partial<Experience> }, { rejectWithValue }) => {
    try {
      const response = await updateServicemanExperienceApi(id, experienceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update experience');
    }
  }
);

export const deleteServicemanExperience = createAsyncThunk(
  'servicemanExperience/deleteExperience',
  async (experienceId: number, { rejectWithValue }) => {
    try {
      await deleteServicemanExperienceApi(experienceId);
      return experienceId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete experience');
    }
  }
);

const servicemanExperienceSlice = createSlice({
  name: 'servicemanExperience',
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
      .addCase(fetchServicemanExperiences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicemanExperiences.fulfilled, (state, action: PayloadAction<Experience[]>) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchServicemanExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add experience
      .addCase(addServicemanExperience.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addServicemanExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.addLoading = false;
        state.experiences.push(action.payload);
      })
      .addCase(addServicemanExperience.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.payload as string;
      })
      // Update experience
      .addCase(updateServicemanExperience.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateServicemanExperience.fulfilled, (state, action: PayloadAction<Experience>) => {
        state.updateLoading = false;
        const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(updateServicemanExperience.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Delete experience
      .addCase(deleteServicemanExperience.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteServicemanExperience.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleteLoading = false;
        state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
      })
      .addCase(deleteServicemanExperience.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearErrors } = servicemanExperienceSlice.actions;
export default servicemanExperienceSlice.reducer;
