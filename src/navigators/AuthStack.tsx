import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackParamList} from '../constant/Routes';

const Stack = createStackNavigator<AuthStackParamList>();

// TODO: Replace with actual auth screens
import {View, Text, StyleSheet} from 'react-native';

const LoginScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Login Screen</Text>
  </View>
);

const RegisterScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Register Screen</Text>
  </View>
);

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthStack;

