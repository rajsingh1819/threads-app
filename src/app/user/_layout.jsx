import React from "react";
import { Stack } from "expo-router";
import AuthGuard from "../../util/AuthGuard";

const UserLayout = () => {
  return (
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" />
        <Stack.Screen name="/profileChange" />
      </Stack>
    </AuthGuard>
  );
};

export default UserLayout;
