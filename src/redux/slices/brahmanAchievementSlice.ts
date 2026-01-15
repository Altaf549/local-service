import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getBrahmanAchievements,
  addBrahmanAchievement as addBrahmanAchievementApi,
  updateBrahmanAchievement as updateBrahmanAchievementApi,
  deleteBrahmanAchievement as deleteBrahmanAchievementApi,
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

export const fetchBrahmanAchievements = createAsyncThunk(
  'brahmanAchievements/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrahmanAchievements();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch achievements');
    }
  }
);

export const addNewBrahmanAchievement = createAsyncThunk(
  'brahmanAchievements/addNew',
  async (achievementData: Omit<AchievementData, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await addBrahmanAchievementApi(achievementData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add achievement');
    }
  }
);

export const updateExistingBrahmanAchievement = createAsyncThunk(
  'brahmanAchievements/update',
  async ({ id, achievementData }: { id: number; achievementData: Partial<AchievementData> }, { rejectWithValue }) => {
    try {
      const response = await updateBrahmanAchievementApi(id, achievementData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update achievement');
    }
  }
);

export const removeBrahmanAchievement = createAsyncThunk(
  'brahmanAchievements/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteBrahmanAchievementApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete achievement');
    }
  }
);

const brahmanAchievementSlice = createSlice({
  name: 'brahmanAchievements',
  initialState,
  reducers: {
    clearBrahmanAchievements: (state) => {
      state.achievements = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch achievements
    builder.addCase(fetchBrahmanAchievements.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBrahmanAchievements.fulfilled, (state, action: PayloadAction<AchievementData[]>) => {
      state.loading = false;
      state.achievements = action.payload;
    });
    builder.addCase(fetchBrahmanAchievements.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add achievement
    builder.addCase(addNewBrahmanAchievement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addNewBrahmanAchievement.fulfilled, (state, action: PayloadAction<AchievementData>) => {
      state.loading = false;
      state.achievements.push(action.payload);
    });
    builder.addCase(addNewBrahmanAchievement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update achievement
    builder.addCase(updateExistingBrahmanAchievement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExistingBrahmanAchievement.fulfilled, (state, action: PayloadAction<AchievementData>) => {
      state.loading = false;
      const index = state.achievements.findIndex(ach => ach.id === action.payload.id);
      if (index !== -1) {
        state.achievements[index] = action.payload;
      }
    });
    builder.addCase(updateExistingBrahmanAchievement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete achievement
    builder.addCase(removeBrahmanAchievement.fulfilled, (state, action: PayloadAction<number>) => {
      state.achievements = state.achievements.filter(ach => ach.id !== action.payload);
    });
  },
});

export const { clearBrahmanAchievements } = brahmanAchievementSlice.actions;

export default brahmanAchievementSlice.reducer;
