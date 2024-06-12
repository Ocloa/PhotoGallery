import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(243,244,246)',
    card: 'rgb(33, 37, 41)',
    text: 'rgb(255,247,242)',
  },
  headerTitleAlign: 'center',
};

export type RootStackParamList = {
  Gallery: undefined;
  Photo: { photo: { id: string; urls: { small: string; regular: string; } } };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator  initialRouteName="Gallery">
        <Stack.Screen name="Gallery" component={HomeScreen} options={{ title: 'Unsplash Gallery', headerTitleAlign: 'center' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
