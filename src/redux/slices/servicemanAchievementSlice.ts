import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getServicemanAchievements,
  addServicemanAchievement as addServicemanAchievementApi,
  updateServicemanAchievement as updateServicemanAchievementApi,
  deleteServicemanAchievement as deleteServicemanAchievementApi,
} from '../../services/api';

export interface AchievementData {
  id?: number;
  title: string;
  description: string;
  achieved_date: string;
  created_at?: string;
  updated_at?: string;
}

interface AchievementState {
  achievements: AchievementData[];
  loading: boolean;
  error: string | null;
}

const initialState: AchievementState = {
  achievements: [],
  loading: false,
  error: null,
};

export const fetchServicemanAchievements = createAsyncThunk(
  'servicemanAchievements/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getServicemanAchievements();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch achievements');
    }
  }
);

export const addNewServicemanAchievement = createAsyncThunk(
  'servicemanAchievements/addNew',
  async (achievementData: Omit<AchievementData, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await addServicemanAchievementApi(achievementData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add achievement');
    }
  }
);

export const updateExistingServicemanAchievement = createAsyncThunk(
  'servicemanAchievements/update',
  async ({ id, achievementData }: { id: number; achievementData: Partial<AchievementData> }, { rejectWithValue }) => {
    try {
      const response = await updateServicemanAchievementApi(id, achievementData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update achievement');
    }
  }
);

export const removeServicemanAchievement = createAsyncThunk(
  'servicemanAchievements/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteServicemanAchievementApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete achievement');
    }
  }
);

const servicemanAchievementSlice = createSlice({
  name: 'servicemanAchievements',
  initialState,
  reducers: {
    clearServicemanAchievements: (state) => {
      state.achievements = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch achievements
    builder.addCase(fetchServicemanAchievements.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchServicemanAchievements.fulfilled, (state, action: PayloadAction<AchievementData[]>) => {
      state.loading = false;
      state.achievements = action.payload;
    });
    builder.addCase(fetchServicemanAchievements.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add achievement
    builder.addCase(addNewServicemanAchievement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addNewServicemanAchievement.fulfilled, (state, action: PayloadAction<AchievementData>) => {
      state.loading = false;
      state.achievements.push(action.payload);
    });
    builder.addCase(addNewServicemanAchievement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update achievement
    builder.addCase(updateExistingServicemanAchievement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExistingServicemanAchievement.fulfilled, (state, action: PayloadAction<AchievementData>) => {
      state.loading = false;
      const index = state.achievements.findIndex(ach => ach.id === action.payload.id);
      if (index !== -1) {
        state.achievements[index] = action.payload;
      }
    });
    builder.addCase(updateExistingServicemanAchievement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete achievement
    builder.addCase(removeServicemanAchievement.fulfilled, (state, action: PayloadAction<number>) => {
      state.achievements = state.achievements.filter(ach => ach.id !== action.payload);
    });
  },
});

export const { clearServicemanAchievements } = servicemanAchievementSlice.actions;

export default servicemanAchievementSlice.reducer;
