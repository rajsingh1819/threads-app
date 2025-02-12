import { View } from "react-native";
import React from "react";
import { router } from "expo-router";
import CheckPrivacyStatus from "../../components/userSettings/checkPrivacy";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBack from "../../constant/HeaderBack";
import ButtonComp from "../../constant/ButtonComp";
import userLogout from "../../util/userLogout"; 

const Setting = () => {
  const handleBackPress = () => {
    router.canGoBack() ? router.back() : router.replace("/profile");
  };

  // Call the userLogout hook to get the handleLogout function
  const handleLogout = userLogout(); 

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center">
        <View className="w-full sm:w-1/2 flex-1 p-1 gap-2">
          <HeaderBack title="Setting" onPress={handleBackPress} />
          <CheckPrivacyStatus />
          {/* Logout Button */}
          <ButtonComp title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;
