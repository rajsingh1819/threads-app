import React from "react";
import { Stack } from "expo-router";

const IndexLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen
        name="threads/[postId]"
        options={{ title: "threads", headerShown: false }}
      />
      <Stack.Screen
        name="reply"
        options={{ title: "reply", headerShown: false }}
      />
    </Stack>
  );
};

export default IndexLayout;
