import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const goBack = () => {
    router.replace("/");
  };
  return (
    <SafeAreaView className="flex-1 justify-between mt-6 ">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center"
        onPress={goBack}
      >
        <ChevronLeft size={30} />
        <Text className="ml-2 text-xl">Back</Text>
      </TouchableOpacity>
      <View className="items-center">
        <Text> Under Developing..</Text>
        <Text className="text-base font-semibold">
          please wait For some time...
        </Text>
      </View>

      <View></View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
