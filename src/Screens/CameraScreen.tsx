import {
  CommonActions,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import GridOverlay from '../components/Grid';
import { MainStackNavigationProps } from '../types/navigation';
import { FLIP_CAM, GRID } from '../utils/images';
import { savePhotoEntry } from '../utils/localDB';
import { useAppTheme } from '../utils/theme';

const CameraScreen = () => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const { colors } = useTheme();
  const [title, setTitle] = React.useState('');
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>(
    'back',
  );
  const device = useCameraDevice(cameraPosition);
  const camera = useRef<Camera>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [destPath, setDestPath] = useState('');
  const navigation = useNavigation<MainStackNavigationProps>();

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      console.log('Camera permission:', permission);
    })();
  }, []);

  const capturePhoto = async () => {
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({ flash: 'off' });
    const destPath = `${RNFS.DocumentDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.copyFile(photo.path, destPath);
    setModalVisible(true);
    setDestPath(`file://${destPath}`);
  };
  const SaveToGallery = () => {
    setModalVisible(false);
    savePhotoEntry(`file://${destPath}`, title, new Date().toISOString());
    setTitle('');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'GalleryScreen',
          },
        ],
      }),
    );
  };

  const toggleCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  };

  if (!device) return <Text>Loading camera...</Text>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
      />
      {showGrid && <GridOverlay />}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => setShowGrid(prev => !prev)}
        >
          <Image style={styles.image} source={GRID} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => capturePhoto()}
        >
          <View style={styles.innerCircle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => toggleCamera()}
        >
          <Image style={styles.image} source={FLIP_CAM} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ marginBottom: 20 }}>
              <Image source={{ uri: destPath }} style={styles?.captureImg} />
            </View>
            <View>
              <Text style={styles.modalText}>Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                placeholderTextColor={'grey'}
                value={title}
                onChangeText={setTitle}
              />
              {showError && !title && (
                <Text style={{ color: 'red' }}>Title is required</Text>
              )}
            </View>
            <View style={styles.buttonWrapper}>
              <Pressable
                // disabled={!title}
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (!title) {
                    setShowError(true);
                    return;
                  } else {
                    SaveToGallery();
                  }
                }}
              >
                <Text style={[styles.textStyle, { color: 'white' }]}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={[styles.textStyle, { color: 'black' }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    controls: {
      position: 'absolute',
      bottom: 40,
      width: '100%',
      paddingHorizontal: 40,
      gap: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    input: {
      // backgroundColor: theme.colors.inputBackground,
      padding: 10,
      borderRadius: 6,
      color: 'black',
      borderColor: theme.colors.border,
      borderWidth: 1,
      fontSize: 16,
      marginBottom: 10,
    },

    itemContainer: {
      width: 60,
      height: 60,

      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'white',
    },
    image: {
      width: 28,
      height: 28,
      // tintColor: theme.colors.text,
    },
    innerCircle: {
      width: 40,
      height: 40,
      borderRadius: 30,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
    },
    button: {
      width: 100,
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      flex: 1,
      marginHorizontal: 5,
    },
    buttonOpen: {
      backgroundColor: '#F3F3F3',
      color: 'grey',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      // color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      // textAlign: 'center',
    },
    buttonWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    captureImg: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
  });

export default CameraScreen;
