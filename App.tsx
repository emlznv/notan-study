import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Splash from './src/screens/Splash/Splash';
import Onboarding from './src/screens/Onboarding/Onboarding';
import Home from './src/screens/Home/Home';
import { useEffect, useState } from 'react';
import ImageProcessing from './src/screens/ImageProcessing/ImageProcessing';

const Stack = createNativeStackNavigator();

const splash_timeout = 2000;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const launched = await AsyncStorage.getItem('isFirstLaunch');
      if (launched === null) {
        await AsyncStorage.setItem('isFirstLaunch', 'false');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
      setTimeout(() => {
        setShowSplash(false);
      }, splash_timeout);
    };

    initializeApp();
  }, []);

  if (showSplash || isFirstLaunch === null) return <Splash />;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isFirstLaunch ? 'Onboarding' : 'Home'}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ImageProcessing" component={ImageProcessing} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
