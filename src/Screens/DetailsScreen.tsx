import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import { MainStackNavigationProps } from '../types/navigation';
import { DELETE } from '../utils/images';
import { deleteEntry } from '../utils/localDB';
import { useAppTheme } from '../utils/theme';

const DetailScreen = () => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const route = useRoute<any>();
  const { entry } = route.params;
  const navigation = useNavigation<MainStackNavigationProps>();

  const deletePhoto = async () => {
    await RNFS.unlink(entry.uri.replace('file://', ''));
    deleteEntry(entry.id);

    navigation.goBack();
  };
  useEffect(() => {
    if (entry?.title) {
      navigation.setOptions({ title: entry.title });
    }
  }, [navigation, entry?.title]);
  return (
    <View style={styles.container}>
      <Image source={{ uri: entry.uri }} style={styles.image} />
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.timestamp}>
        {moment(entry.timestamp).format('DD-MMM-YYYY')}
      </Text>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            deletePhoto();
          }}
        >
          <Image source={DELETE} style={styles.icon} />
          <Text style={{ color: theme.colors.text }}>Delete</Text>
        </TouchableOpacity>

        {/* <Button
          title="Delete"
          onPress={() => {
            deletePhoto();
            // Alert.alert('Alert', 'Are you sure you want to Delete?', [
            //   {
            //     text: 'Cancel',
            //     onPress: () => console.log('Cancel Pressed'),
            //     style: 'cancel', // 'cancel' style is typically for the dismissive button
            //   },
            //   {
            //     text: 'OK',
            //     onPress: () => {
            //       deletePhoto();
            //     },
            //   },
            // ]);
          }}
        /> */}
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: 8,
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    timestamp: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 16,
    },
    buttonWrapper: {
      marginTop: 20,
    },
    deleteButton: {
      backgroundColor: theme.colors.primary,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      width: 200,
      alignSelf: 'center',
      marginTop: 20,
    },
    icon: {
      width: 20,
      height: 20,
    },
  });

export default DetailScreen;
