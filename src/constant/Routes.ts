import React from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import ServiceScreen from '../screens/service/ServiceScreen';
import PujaScreen from '../screens/puja/PujaScreen';
import ServicemanScreen from '../screens/serviceman/ServicemanScreen';
import BrahmanScreen from '../screens/brahman/BrahmanScreen';
import ServiceCategoryScreen from '../screens/service/ServiceCategoryScreen';
import PujaTypeScreen from '../screens/puja/PujaTypeScreen';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
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
export const BRAHMAN = 'Brahman';
export const SERVICE_CATEGORY = 'ServiceCategory';
export const PUJA_TYPE = 'PujaType';

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

