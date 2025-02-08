import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { Ellipsis } from "lucide-react-native"; // Import the correct icon
import imagePath from "../../constant/imagePath";
import { useSelector } from "react-redux";
import ImageView from "../../util/ImageView";

const Media = ({ posts }) => {
  const { user } = useSelector((state) => state.auth);
  if (!posts || posts.length === 0) {
    return (
      <View className="p-4">
        <Text>No Media available.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1  p-2 mt-5 ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id.toString()} // Assuming _id is unique
        renderItem={({ item }) => (
          <View className="flex-row pb-1 mb-2 gap-2 border-b border-gray-300">
            <Image
              source={{
                uri: item?.user?.avatar?.cloudinary || imagePath?.user,
              }}
              className="h-10 w-10 rounded-full"
              resizeMode="contain"
            />

            {/* Post Details */}
            <View className="flex-1 justify-center gap-3 ">
              <View className="flex-row gap-3 items-center">
                {/* Username Navigation */}
                <View className="flex-1 flex-row items-center">
                  <Text className="text-lg font-bold text-gray-800">
                    {item?.user?.username || "Unknown"}
                  </Text>
                </View>

                {/* Post Timestamp & Options */}
                <View className="flex-row items-center gap-2">
                  <Text className="text-slate-800">
                    {formatDistanceToNow(new Date(item?.createdAt), {
                      addSuffix: true,
                    })}
                  </Text>
                  {user?._id == item?.user?._id && (
                    <TouchableOpacity>
                      <Ellipsis size={25} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Post Image */}
              <View className="p-4 ">
                <ImageView
                  imageUri={item?.images?.cloudinary}
                  className="w-full h-44 mb-3"
                />
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Media;
