import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import imagePath from "../constant/imagePath";

const Index = () => {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Simulate splash screen loading
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsSplashLoading(false);
    }, 3000); // 3 seconds splash duration
    return () => clearTimeout(splashTimeout);
  }, []);

  // Check authentication token after splash screen
  useEffect(() => {
    const checkToken = async () => {
      setIsCheckingAuth(true);
      try {
        const token = await AsyncStorage.getItem("authToken"); // Get token from AsyncStorage
        setAuthToken(token); // Save token to state
      } catch (err) {
        console.error("Error reading authToken:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (!isSplashLoading) {
      checkToken();
    }
  }, [isSplashLoading]);

  // Splash screen display
  if (isSplashLoading) {
    return (
      <SafeAreaView className="flex-1 items-center px-5 bg-green-500">
        <View className="flex-1 justify-center items-center">
          <Image
            source={{ uri: imagePath?.logo }} // Replace with your actual logo path
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

  // Loader for token check
  if (isCheckingAuth) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} color="black" />
      </View>
    );
  }

  // Redirect based on token presence
  return authToken ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
};

export default Index;
