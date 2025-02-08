import React from "react";
import { Stack } from "expo-router";

const PostLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Setting",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default PostLayout;
