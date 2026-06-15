import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AddHomeScreen from '../screens/AddHomeScreen';


export type RootStackParamList = {
  Splash: undefined;   
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
  MainApp: undefined;   // ← bottom tabs live here
  AddHomeScreen: {
    image: string;
    latitude: number;
    longitude: number;
  };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"   // ✅ Always start at Splash
      >
        <Stack.Screen name="Splash"         component={SplashScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="AddHomeScreen" component={AddHomeScreen} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;