import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { usePermissions } from '../hooks/PermissionHandler';
import { MainStackNavigationProps } from '../types/navigation';
import { DARK_CAM, LIGHT_CAM } from '../utils/images';
import { useAppTheme } from '../utils/theme';

const FloatFilterButton = () => {
  const navigation = useNavigation<MainStackNavigationProps>();
  const theme = useAppTheme();
  const { requestCameraPermission } = usePermissions();

  const styles = getStyles();

  const handleCapture = async () => {
    try {
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) return;

      navigation.navigate('CameraScreen');
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        handleCapture();
      }}
    >
      <Image style={styles.image} source={theme?.dark ? DARK_CAM : LIGHT_CAM} />
    </TouchableOpacity>
  );
};

export default FloatFilterButton;
const getStyles = () =>
  StyleSheet.create({
    itemContainer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 40,
      height: 40,
      backgroundColor: '#25D366',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 20,
      height: 20,

      borderRadius: 8,
    },
  });
