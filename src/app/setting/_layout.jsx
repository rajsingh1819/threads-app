import React from "react";
import { Stack } from "expo-router";
import AuthGuard from "../../util/AuthGuard";

const PostLayout = () => {
  return (
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Setting",
            headerShown: false,
          }}
        />
      </Stack>
    </AuthGuard>
  );
};

export default PostLayout;
