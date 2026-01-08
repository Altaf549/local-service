import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from './BottomTabNavigator';
import ServiceCategoryScreen from '../screens/service/ServiceCategoryScreen';
import PujaTypeScreen from '../screens/puja/PujaTypeScreen';
import ServiceCategoryDetailsScreen from '../screens/service/ServiceCategoryDetailsScreen';
import PujaTypeDetailsScreen from '../screens/puja/PujaTypeDetailsScreen';
import ServiceDetailsScreen from '../screens/service/ServiceDetailsScreen';
import PujaDetailsScreen from '../screens/puja/PujaDetailsScreen';
import ServicemanDetailsScreen from '../screens/serviceman/ServicemanDetailsScreen';
import BrahmanDetailsScreen from '../screens/brahman/BrahmanDetailsScreen';
import { 
  PUJA_TYPE, 
  SERVICE_CATEGORY,
  SERVICE_CATEGORY_DETAILS,
  PUJA_TYPE_DETAILS,
  SERVICE_DETAILS,
  PUJA_DETAILS,
  SERVICEMAN_DETAILS,
  BRAHMAN_DETAILS
} from '../constant/Routes';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name={SERVICE_CATEGORY} component={ServiceCategoryScreen} />
      <Stack.Screen name={PUJA_TYPE} component={PujaTypeScreen} />
      <Stack.Screen name={SERVICE_CATEGORY_DETAILS} component={ServiceCategoryDetailsScreen} />
      <Stack.Screen name={PUJA_TYPE_DETAILS} component={PujaTypeDetailsScreen} />
      <Stack.Screen name={SERVICE_DETAILS} component={ServiceDetailsScreen} />
      <Stack.Screen name={PUJA_DETAILS} component={PujaDetailsScreen} />
      <Stack.Screen name={SERVICEMAN_DETAILS} component={ServicemanDetailsScreen} />
      <Stack.Screen name={BRAHMAN_DETAILS} component={BrahmanDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;

