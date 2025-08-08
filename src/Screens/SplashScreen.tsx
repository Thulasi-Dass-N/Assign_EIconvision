// SplashScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { MainStackNavigationProps } from '../types/navigation';
import { useAppTheme } from '../utils/theme';

const SplashScreen = () => {
  const navigation = useNavigation<MainStackNavigationProps>();
  const theme = useAppTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      navigation.replace('GalleryScreen');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation, fadeAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Animated.Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            opacity: fadeAnim,
            transform: [{ rotate }],
          },
        ]}
      >
        Photo Journal
      </Animated.Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={{ color: theme.colors.primary }}>Welcome...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SplashScreen;
