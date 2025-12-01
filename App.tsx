import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Splash from './src/screens/Splash/Splash';
import Onboarding from './src/screens/Onboarding/Onboarding';
import Home from './src/screens/Home/Home';
import { useEffect, useState } from 'react';
import ImageProcessing from './src/screens/ImageProcessing/ImageProcessing';
import { lightTheme } from './src/utils/theme/theme';
import { SPLASH_TIMEOUT } from './src/utils/constants/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ImageProcessing: { imageUri: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
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
      }, SPLASH_TIMEOUT);
    };

    initializeApp();
  }, []);

  if (showSplash || isFirstLaunch === null) return <Splash />;

  return (
    <PaperProvider theme={lightTheme}>
      <GestureHandlerRootView>
        <View style={styles.container}>
          <StatusBar barStyle={'light-content'} />
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={isFirstLaunch ? 'Onboarding' : 'Home'}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen
                name="ImageProcessing"
                component={ImageProcessing}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
