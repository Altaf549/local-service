import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from './BottomTabNavigator';
import ServiceCategoryScreen from '../screens/service/ServiceCategoryScreen';
import PujaTypeScreen from '../screens/puja/PujaTypeScreen';
import { PUJA_TYPE, SERVICE_CATEGORY } from '../constant/Routes';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name={SERVICE_CATEGORY} component={ServiceCategoryScreen} />
      <Stack.Screen name={PUJA_TYPE} component={PujaTypeScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;

