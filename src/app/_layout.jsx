import * as SplashScreen from "expo-splash-screen"; // Add this import
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../../global.css";
import { Provider } from "react-redux";
import store from "../provider/store/store";
import Toast from "react-native-toast-message";
import { router, Stack } from "expo-router";
import _middleware from "./_middleware"; // Import the middleware

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Return null until the fonts are loaded
  }

  return (
    <Provider store={store}>
      <_middleware />
       {/* Add middleware to the layout */}
      <Stack initialRouteName="index"  >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="post" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />


      </Stack>
      <Toast position="top" />
    </Provider>
  );
}
