import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppStack from './src/Navigation/AppStack';
import { initDB } from './src/utils/localDB';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    initDB(); // 🔧 This ensures the table exists
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: isDarkMode ? 'black' : 'white' },
        ]}
      >
        <View style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppStack />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default App;
