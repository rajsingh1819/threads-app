import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPrivate } from "../../provider/userAllApi";
import { checkAuth } from "../../provider/auth";
import { showToast } from "../../constant/showToast";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import CheckPrivacyStatus from "../../components/userSettings/checkPrivacy";
import UserLogout from "../../components/userSettings/userLogout";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-2 gap-2">
        <Stack.Screen
          options={{
            headerTitle: "Setting",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity
                className="flex-row"
                onPress={() => router.push("/profile")}
              >
                <ChevronLeft size={25} color="#000" />
                <Text className="text-base font-semibold"> Back</Text>
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
          }}
        />
        <CheckPrivacyStatus />
        <UserLogout />
      </View>
    </SafeAreaView>
  );
};

export default Setting;
