import { View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { router } from "expo-router";
import CheckPrivacyStatus from "../../components/userSettings/checkPrivacy";
import UserLogout from "../../components/userSettings/userLogout";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkAuth } from "../../provider/auth";
import HeaderBack from "../../constant/HeaderBack";
import AuthGuard from "../../components/AuthGuard";

const Setting = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Navigate back
  const handleBackPress = () => {
    router.canGoBack() ? router.back() : router.push("/profile");
  };

  return (
    <AuthGuard>
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center">
          <View className="w-full sm:w-1/2 flex-1 p-1 gap-2">
            <HeaderBack title="Setting" onPress={handleBackPress} />

            <CheckPrivacyStatus />
            <UserLogout />
          </View>
        </View>
      </SafeAreaView>
    </AuthGuard>
  );
};

export default Setting;
