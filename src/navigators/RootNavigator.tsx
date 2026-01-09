import React, {useEffect} from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import FlashMessage from 'react-native-flash-message';
import {AppDispatch} from '../redux/store';
import {RootStackParamList} from '../constant/Routes';
import AppStack from './AppStack';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParamList>>();

// TODO: Replace with actual GlobalLoader component
const GlobalLoader = () => null;

const RootNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    RNBootSplash.hide({fade: true});
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

