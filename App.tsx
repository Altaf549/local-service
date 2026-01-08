/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {ThemeProvider, useTheme} from './src/theme/ThemeContext';
import RootNavigator from './src/navigators/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  function AppContent() {
    const insets = useSafeAreaInsets();
    const {theme} = useTheme();

    return (
      <>
        <View
          style={{
            backgroundColor: theme.colors.whiteBackground,
          }}
        />
        <SafeAreaView
          edges={['left', 'right', 'bottom']}
          style={{flex: 1, backgroundColor: theme.colors.whiteBackground}}>
          <RootNavigator />
        </SafeAreaView>
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
