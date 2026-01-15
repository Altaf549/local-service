import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
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
import bookingReducer from './slices/bookingSlice';
import servicemanProfileReducer from './slices/servicemanProfileSlice';
import brahmanProfileReducer from './slices/brahmanProfileSlice';
import deleteAccountReducer from './slices/deleteAccountSlice';
import servicePricesReducer from './slices/servicePricesSlice';
import pujaPricesReducer from './slices/pujaPricesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
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
    bookings: bookingReducer,
    servicemanProfile: servicemanProfileReducer,
    brahmanProfile: brahmanProfileReducer,
    deleteAccount: deleteAccountReducer,
    servicePrices: servicePricesReducer,
    pujaPrices: pujaPricesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

