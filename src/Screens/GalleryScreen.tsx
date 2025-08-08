// screens/GalleryScreen.tsx
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FloatFilterButton from '../components/FloatingIcon';
import { MainStackNavigationProps } from '../types/navigation';
import { useDoubleBackExitOnScreen } from '../utils/exitApp';
import { getPhotoEntries } from '../utils/localDB';
import { useAppTheme } from '../utils/theme';

const { height } = Dimensions.get('window');

const GalleryScreen = () => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  useDoubleBackExitOnScreen('GalleryScreen');
  const [entries, setEntries] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<MainStackNavigationProps>();

  const loadEntries = async () => {
    setRefreshing(true);
    const data = await getPhotoEntries();
    setEntries(data);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  return (
    <>
      <FlatList
        scrollEnabled={entries.length > 0 ? true : false}
        data={entries}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadEntries} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailsScreen', { entry: item })
            }
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyData}>
            <Text style={styles.emptyText}>No photos found</Text>
          </View>
        }
        contentContainerStyle={{ padding: 10 }}
        style={{ backgroundColor: theme.colors.background }}
        showsVerticalScrollIndicator={false}
      />
      <FloatFilterButton />
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    image: {
      width: 60,
      height: 60,
      marginRight: 10,
      borderRadius: 8,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
    },
    emptyData: {
      height: height - 200,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    emptyText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
  });

export default GalleryScreen;
