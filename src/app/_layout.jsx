import "react-native-reanimated";
import "../../global.css";
import { Provider } from "react-redux";
import store from "../provider/store/store";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Gesture Handler Root

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Provider store={store}>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="post"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen name="setting" options={{ headerShown: false }} />
          <Stack.Screen name="user" options={{ headerShown: false }} />
        </Stack>
        <Toast position="top" />
      </Provider>
    </GestureHandlerRootView>
  );
}
