
import React from "react";
import { Stack } from "expo-router";

const UserLayout = () => {
  return (
   <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="[id]"/>
   </Stack>
  );
};

export default UserLayout;
