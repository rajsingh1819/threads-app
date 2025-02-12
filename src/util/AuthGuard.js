import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";

const AuthGuard = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        router.replace("/(auth)"); // Redirect to auth if no token
      } else {
        setAuthToken(token);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return authToken ? children : <Redirect href="/(auth)" />;
};

export default AuthGuard;
