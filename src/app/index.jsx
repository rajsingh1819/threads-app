import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { Redirect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth  } from "../provider/auth";
import imagePath from "../constant/imagePath";



const Index = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial splash loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timeout); 
  }, []);

  // Check authentication after splash loading
  useEffect(() => {
    if (!isLoading) {
      dispatch(checkAuth ());
    }
  }, [isLoading, dispatch]);


  if (isLoading) {
    // Show the loading screen first
    return (
      <SafeAreaView className="flex-1 items-center px-5 bg-green-500">
        <View className="flex-1 justify-center items-center">
          <Image
            source={{ uri: imagePath?.logo }} // Placeholder image
            className="w-36 h-24"
            resizeMode="contain"
          />
        </View>
        <View className="h-16 items-center mt-5 mb-2">
          <ActivityIndicator size="large" color="black" className="mb-2" />
          <Text className="text-base text-black">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (authLoading) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator size={30} color="black"/></View>;
  }

  // Navigate based on authentication state
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
};

export default Index;
