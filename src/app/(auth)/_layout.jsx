import { Stack } from "expo-router";
import { Text } from "react-native";


export default () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       
      <Stack.Screen name="index" />
    
      <Stack.Screen name="forgotPassword" />

    
     
    
    </Stack>
  );
};
