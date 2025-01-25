import { Stack } from "expo-router";
import { Text } from "react-native";

export default () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="next" />
      <Stack.Screen name="forgot" />
    </Stack>
  );
};
