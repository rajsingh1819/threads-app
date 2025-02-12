import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPrivate } from "../../provider/userAllApi";
import { checkAuth } from "../../provider/auth";
import { showToast } from "../../constant/showToast";
import { router } from "expo-router";
const CheckPrivacyStatus = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  const [isPrivateBoolean, setIsPrivateBoolean] = useState();

  useEffect(() => {
    if (user) {
      setIsPrivateBoolean(user.isPrivate); // Set initial state based on user's privacy
    }
  }, [user]);

  const changePrivacy = async (targetPrivacy) => {
    if (targetPrivacy === isPrivateBoolean) {
      showToast(
        "info",
        `Your account is already ${targetPrivacy ? "private" : "public"}.`
      );
      return;
    }

    const result = await checkPrivate({
      userId: user?._id,
      isPrivate: targetPrivacy,
    });
    if (result.success) {
      showToast(
        "success",
        `${result?.data?.message || "Privacy updated successfully"} 🎉`
      );
      setIsPrivateBoolean(targetPrivacy);
      router.replace("/profile");
    } else {
      showToast("error", result.message);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        dispatch(checkAuth());
      }
    };

    if (isAuthenticated === null) {
      checkAuthentication(); // Only call when the state is not set
    }
  }, [dispatch, isAuthenticated]); // Trigger once when the state is not determined yet

  // Show loader while authentication is being checked
  if (isPrivateBoolean === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="p-2">
      <Text className="text-xl font-semibold mb-5">
        Change Your Account Type
      </Text>
      <View className="flex-row gap-5">
        {/* Public Option */}
        <Pressable
          className="flex-row items-center"
          onPress={() => changePrivacy(false)}
        >
          <View
            className={`h-12 w-12 rounded-full ${
              !isPrivateBoolean ? "bg-black" : "bg-white"
            } border border-black`}
          />
          <Text className="ml-2 text-black">Public</Text>
        </Pressable>

        <Pressable
          className="flex-row items-center"
          onPress={() => changePrivacy(true)}
        >
          <View
            className={`h-12 w-12 rounded-full ${
              isPrivateBoolean ? "bg-black" : "bg-white"
            } border border-black`}
          />
          <Text className="ml-2 text-black">Private</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CheckPrivacyStatus;
