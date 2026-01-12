import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  token?: string;
  role?: string;
  status?: string;
  availability_status?: string;
  [key: string]: any;
}

interface UserState {
  userData: UserData | null;
  isUser: boolean;
}

const initialState: UserState = {
  userData: null,
  isUser: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setIsUser: (state, action: PayloadAction<boolean>) => {
      state.isUser = action.payload;
    },
    clearUserData: state => {
      state.userData = null;
      state.isUser = false;
    },
    logoutUser: state => {
      state.userData = null;
      state.isUser = false;
    },
  },
});

export const {setUserData, setIsUser, clearUserData, logoutUser} = userSlice.actions;
export default userSlice.reducer;

