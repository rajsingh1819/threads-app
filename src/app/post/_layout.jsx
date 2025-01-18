import React from "react";
import { Stack } from "expo-router";

const PostLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "New Thread",
          headerShown: true,
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default PostLayout;
