// hooks/useDoubleBackExitOnScreen.ts
import { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

export const useDoubleBackExitOnScreen = (targetRouteName: string) => {
  const lastBackPress = useRef(0);

  const isTargetScreen = useNavigationState((state) => {
    const currentRoute = state.routes[state.index];
    return currentRoute.name === targetRouteName;
  });

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (!isTargetScreen) return false;

      const now = Date.now();
      if (lastBackPress.current && now - lastBackPress.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastBackPress.current = now;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, [isTargetScreen]);
};
