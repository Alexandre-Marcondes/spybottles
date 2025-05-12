// src/navigation/StackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// ✅ Import all screens
import HomeScreen from '../screens/HomeScreen';
import SessionScreen from '../screens/SessionScreen';
import ProductSearchScreen from '../screens/ProductSearchScreen';
import FinalizeScreen from '../screens/FinalizeScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Home: undefined;
  Session: {sessionId: string | null }; 
  ProductSearch: undefined;
  Finalize: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
      <Stack.Screen name="ProductSearch" component={ProductSearchScreen} />
      <Stack.Screen name="Finalize" component={FinalizeScreen} />
      
    </Stack.Navigator>
  );
};

export default StackNavigator;
