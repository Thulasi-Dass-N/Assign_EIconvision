import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
const openAppSettings = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Error', 'Unable to open app settings');
  });
};
export const usePermissions = () => {
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      console.log('Camera permission result:', result);

      // return result === PermissionsAndroid.RESULTS.GRANTED;
      if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission required',
          'Camera access was denied permanently. Please enable it from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openAppSettings },
          ],
        );
      }
      return false;
    } catch (e) {
      console.warn('Camera permission error:', e);
      return false;
    }
  };

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const sdkVersion = Platform.constants?.Release
      ? parseInt(Platform.constants.Release.split('.')[0], 10)
      : 0;

    try {
      if (sdkVersion < 13) {
        // Android 10–12
        // const result = await PermissionsAndroid.requestMultiple([
        //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // ]);
        // return Object.values(result).every(
        //   res => res === PermissionsAndroid.RESULTS.GRANTED,
        // );

        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        const values = Object.values(result);

        const isGranted = values.every(
          res => res === PermissionsAndroid.RESULTS.GRANTED,
        );

        const isNeverAskAgain = values.some(
          res => res === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
        );

        if (isNeverAskAgain) {
          Alert.alert(
            'Storage Permission Required',
            'Storage access was permanently denied. Please enable it manually in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openAppSettings },
            ],
          );
        }

        return isGranted;
      } else {
        // Android 13+ (Photo Picker API)
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );

        // return result === PermissionsAndroid.RESULTS.GRANTED;
        if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission required',
            'Storage access was denied permanently. Please enable it from settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openAppSettings },
            ],
          );
        }

        return false;
      }
    } catch (e) {
      console.warn('Storage permission error:', e);
      return false;
    }
  };

  return { requestCameraPermission, requestStoragePermission };
};
