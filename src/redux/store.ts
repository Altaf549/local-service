import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import homeReducer from './slices/homeSlice';
import serviceCategoryReducer from './slices/serviceCategorySlice';
import serviceReducer from './slices/serviceSlice';
import pujaTypeReducer from './slices/pujaTypeSlice';
import pujaReducer from './slices/pujaSlice';
import servicemanReducer from './slices/servicemanSlice';
import brahmanReducer from './slices/brahmanSlice';
import serviceCategoryDetailsReducer from './slices/serviceCategoryDetailsSlice';
import pujaTypeDetailsReducer from './slices/pujaTypeDetailsSlice';
import serviceDetailsReducer from './slices/serviceDetailsSlice';
import pujaDetailsReducer from './slices/pujaDetailsSlice';
import servicemanDetailsReducer from './slices/servicemanDetailsSlice';
import brahmanDetailsReducer from './slices/brahmanDetailsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    home: homeReducer,
    serviceCategory: serviceCategoryReducer,
    service: serviceReducer,
    pujaType: pujaTypeReducer,
    puja: pujaReducer,
    serviceman: servicemanReducer,
    brahman: brahmanReducer,
    serviceCategoryDetails: serviceCategoryDetailsReducer,
    pujaTypeDetails: pujaTypeDetailsReducer,
    serviceDetails: serviceDetailsReducer,
    pujaDetails: pujaDetailsReducer,
    servicemanDetails: servicemanDetailsReducer,
    brahmanDetails: brahmanDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

