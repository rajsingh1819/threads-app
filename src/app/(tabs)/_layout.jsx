import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Home, Search, Plus, Heart, User } from "lucide-react-native";
import { checkAuth } from "../../provider/auth";
import { useDispatch, useSelector } from "react-redux";

export default function TabLayout() {
  // const dispatch = useDispatch();
  // const { isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);

  

  // useEffect(() => {
  //   // Check authentication when the component is mounted
  //   const checkToken = async () => {
  //    const data= await dispatch(checkAuth());
    
  //    console.log("!data?.payload?.token",!data?.payload?.token)
     
  //    if(!data?.payload?.token){
  //     router.push("/(auth)")
  //    }
  //   };

  //   checkToken();
  // }, [dispatch]);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0a7ea4",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: "Post",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/post"); // Navigate to the post page
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
