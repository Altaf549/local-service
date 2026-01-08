import React, {Suspense} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabParamList, tabConfig} from '../constant/Routes';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {useTheme} from '../theme/ThemeContext';
import {View, ActivityIndicator} from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        const tabItem = tabConfig.find(tab => tab.name === route.name);
        const iconName = tabItem?.icon || 'home';

        return {
          headerShown: false,
          tabBarIcon: ({
            focused,
            color,
            size,
          }: {
            focused: boolean;
            color: string;
            size: number;
          }) => {
            return (
              <MaterialIcon
                name={iconName as React.ComponentProps<typeof MaterialIcon>['name']}
                size={size}
                color={color}
              />
            );
          },
          tabBarLabel: tabItem?.label || route.name,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            elevation: 0,
            shadowOpacity: 0,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 0,
            borderTopWidth: 1,
          },
        };
      }}>
      {tabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

