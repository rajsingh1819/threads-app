import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

const PostLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "New Thread",
          headerShown: true,
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity className="flex-row" onPress={()=>router.push("/(tabs)")}>
              <ChevronLeft size={25} color="#000" />
              <Text className="text-base font-semibold"> Back</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Thread",
          headerShown: true,
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity className="flex-row" onPress={()=>router.push("/(tabs)")}>
              <ChevronLeft size={25} color="#000" />
              <Text className="text-base font-semibold"> Back</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default PostLayout;
