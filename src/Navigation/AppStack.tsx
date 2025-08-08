import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CameraScreen from '../Screens/CameraScreen';
import DetailsScreen from '../Screens/DetailsScreen';
import GalleryScreen from '../Screens/GalleryScreen';
import SplashScreen from '../Screens/SplashScreen';
import { AppStackScreenParamsProps } from '../types/navigation';
import { useAppTheme } from '../utils/theme';
const Stack = createNativeStackNavigator<AppStackScreenParamsProps>();
const AppStack = () => {
  const theme = useAppTheme();
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="SplashScreen"
          component={SplashScreen}
        />
        <Stack.Screen
          options={{ headerShown: true }}
          name="CameraScreen"
          component={CameraScreen}
        />
        <Stack.Screen
          options={{ headerShown: true, title: 'Photo Gallery' }}
          name="GalleryScreen"
          component={GalleryScreen}
        />
        <Stack.Screen
          options={{ headerShown: true }}
          name="DetailsScreen"
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
