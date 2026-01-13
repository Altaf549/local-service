import React, {useEffect, useState} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import FlashMessage from 'react-native-flash-message';
import {AppDispatch, RootState} from '../redux/store';
import {setUserData, setIsUser} from '../redux/slices/userSlice';
import {initializeAuthToken} from '../network/axiosConfig';
import {MAIN_TABS, RootStackParamList, SERVICEMAN_HOME, USER_ROLES} from '../constant/Routes';
import AppStack from './AppStack';
import {StackActions} from '@react-navigation/native';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

// TODO: Replace with actual GlobalLoader component
const GlobalLoader = () => null;

const RootNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isUser, userData} = useSelector((state: RootState) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Initialize auth token from storage
        await initializeAuthToken();

        // Check for stored token and user data
        const token = await AsyncStorage.getItem('user_token');
        const userInfo = await AsyncStorage.getItem('user_info');

        if (token && userInfo) {
          const parsedUserData = JSON.parse(userInfo);
          dispatch(setUserData(parsedUserData));
          dispatch(setIsUser(true));

          // Navigate based on user role after a short delay to ensure navigation is ready
          setTimeout(() => {
            if (parsedUserData.role === USER_ROLES.USER) {
              navigationRef.current?.dispatch(
                StackActions.replace(MAIN_TABS)
              );
            } else if (parsedUserData.role === USER_ROLES.SERVICEMAN || parsedUserData.role === USER_ROLES.BRAHMAN) {
              navigationRef.current?.dispatch(
                StackActions.replace(SERVICEMAN_HOME)
              );
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear any corrupted data
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_info');
      } finally {
        setIsInitialized(true);
        RNBootSplash.hide({fade: true});
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (!isInitialized) {
    return null; // Show nothing while checking auth status
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <FlashMessage position="bottom" />
      <GlobalLoader />
      <AppStack />
    </NavigationContainer>
  );
};

export default RootNavigator;

