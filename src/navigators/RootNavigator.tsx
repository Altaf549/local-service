import React, {useEffect} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNBootSplash from 'react-native-bootsplash';
import FlashMessage from 'react-native-flash-message';
import {AppDispatch} from '../redux/store';
import {setUserData, setIsUser} from '../redux/slices/userSlice';
import {RootStackParamList} from '../constant/Routes';
import AppStack from './AppStack';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

// TODO: Replace with actual GlobalLoader component
const GlobalLoader = () => null;

const RootNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('urser_token');
        if (token) {
          const tokenParseValue = JSON.parse(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenParseValue}`;
          const getUserData = await AsyncStorage.getItem('user_info');
          if (getUserData) {
            const userData = JSON.parse(getUserData);
            dispatch(setUserData(userData));
            dispatch(setIsUser(true));
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    init().finally(async () => {
      console.log('bootsplash hide');
      await RNBootSplash.hide({fade: true});
    });
  }, [dispatch]);

  return (
    <NavigationContainer ref={navigationRef}>
      <FlashMessage position="bottom" />
      <GlobalLoader />
      <AppStack />
    </NavigationContainer>
  );
};

export default RootNavigator;

