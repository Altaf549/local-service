import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ServiceScreen from '../screens/ServiceScreen';
import PujaScreen from '../screens/PujaScreen';
import ServicemanScreen from '../screens/ServicemanScreen';
import BrahmanScreen from '../screens/BrahmanScreen';

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
};

export type TabConfig = {
  name: keyof BottomTabParamList;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
};

export const tabConfig: TabConfig[] = [
  {
    name: 'Home',
    label: 'Home',
    icon: 'home',
    component: HomeScreen,
  },
  {
    name: 'Service',
    label: 'Service',
    icon: 'handyman',
    component: ServiceScreen,
  },
  {
    name: 'Puja',
    label: 'Puja',
    icon: 'temple-hindu',
    component: PujaScreen,
  },
  {
    name: 'Serviceman',
    label: 'Serviceman',
    icon: 'engineering',
    component: ServicemanScreen,
  },
  {
    name: 'Brahman',
    label: 'Brahman',
    icon: 'self-improvement',
    component: BrahmanScreen,
  },
];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

