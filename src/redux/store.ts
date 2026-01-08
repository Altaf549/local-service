import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import homeReducer from './slices/homeSlice';
import serviceCategoryReducer from './slices/serviceCategorySlice';
import serviceReducer from './slices/serviceSlice';
import pujaTypeReducer from './slices/pujaTypeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    home: homeReducer,
    serviceCategory: serviceCategoryReducer,
    service: serviceReducer,
    pujaType: pujaTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

