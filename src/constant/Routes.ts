import React from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import ServiceScreen from '../screens/service/ServiceScreen';
import PujaScreen from '../screens/puja/PujaScreen';
import ServicemanScreen from '../screens/serviceman/ServicemanScreen';
import ServicemanHomeScreen from '../screens/serviceman/ServicemanHomeScreen';
import BrahmanScreen from '../screens/brahman/BrahmanScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  ServicemanHome: undefined;
  ServiceCategory: undefined;
  PujaType: undefined;
  ServiceCategoryDetails: { id: number };
  PujaTypeDetails: { id: number };
  ServiceDetails: { id: number };
  PujaDetails: { id: number };
  ServicemanDetails: { id: number };
  BrahmanDetails: { id: number };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword?: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Service: undefined;
  Puja: undefined;
  Serviceman: undefined;
  Brahman: undefined;
  ServiceCategory: undefined;
  PujaType: undefined;
};

export type TabConfig = {
  name: keyof BottomTabParamList;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
};

export const HOME = 'Home';
export const SERVICE = 'Service';
export const PUJA = 'Puja';
export const SERVICEMAN = 'Serviceman';
export const SERVICEMAN_HOME = 'ServicemanHome';
export const BRAHMAN = 'Brahman';
export const SERVICE_CATEGORY = 'ServiceCategory';
export const PUJA_TYPE = 'PujaType';
export const LOGIN = 'Login';
export const REGISTER = 'Register';
export const MAIN_TABS = 'MainTabs';

// User role constants
export const USER_ROLES = {
  USER: 'user',
  SERVICEMAN: 'serviceman',
  BRAHMAN: 'brahman',
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Detail screen routes
export const SERVICE_CATEGORY_DETAILS = 'ServiceCategoryDetails';
export const PUJA_TYPE_DETAILS = 'PujaTypeDetails';
export const SERVICE_DETAILS = 'ServiceDetails';
export const PUJA_DETAILS = 'PujaDetails';
export const SERVICEMAN_DETAILS = 'ServicemanDetails';
export const BRAHMAN_DETAILS = 'BrahmanDetails';

// Tab configuration array with proper typing
export const tabConfig: TabConfig[] = [
  {
    name: HOME,
    label: 'Home',
    icon: 'home',
    component: HomeScreen,
  },
  {
    name: SERVICE,
    label: 'Service',
    icon: 'home-repair-service',
    component: ServiceScreen,
  },
  {
    name: PUJA,
    label: 'Puja',
    icon: 'temple-hindu',
    component: PujaScreen,
  },
  {
    name: SERVICEMAN,
    label: 'Serviceman',
    icon: 'engineering',
    component: ServicemanScreen,
  },
  {
    name: BRAHMAN,
    label: 'Brahman',
    icon: 'person',
    component: BrahmanScreen,
  },
];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

