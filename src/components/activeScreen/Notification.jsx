import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import imagePath from "../../constant/imagePath";

const Notification = ({ item }) => {
  // console.log("item =>", item);

  return (
    <View className="bg-gray-200 p-2 mb-3 rounded-lg flex-row items-center">
      <Link href={`/user/${item._id}`} asChild>
        <View className="flex-1 flex-row gap-2 items-center">
          <Image
            source={{ uri: item?.avatar?.cloudinary || imagePath?.user }}
            className="h-14 w-14 bg-gray-300 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-black text-lg font-medium">
            {item?.username} following you!
          </Text>
        </View>
      </Link>
    </View>
  );
};

export default Notification;
