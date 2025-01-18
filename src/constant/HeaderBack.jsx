import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";

const HeaderBack = ({ title, onPress, icon, cancel }) => {
  return (
    <View className="flex-row items-center py-2 px-1">
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center flex-[0.4] "
        onPress={onPress}
        activeOpacity={0.8}
      >
        {cancel === "Cancel" ? (
          <Text className="text-lg font-semibold px-1">{cancel}</Text>
        ) : (
          <>
            <ChevronLeft size={30} color="#000" />
            <Text className="text-lg font-semibold">Back</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Title */}
      <View className="flex-1 justify-center items-center">
        <Text className="font-bold text-lg">{title}</Text>
      </View>

      {/* Placeholder for Alignment */}
      <View className="flex-[0.4] bg-orange-300">{icon}</View>
    </View>
  );
};

export default HeaderBack;
