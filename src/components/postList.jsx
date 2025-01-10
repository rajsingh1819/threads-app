import { Image, View, Text, Pressable, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react-native";
import imagePath from "../constant/imagePath";
import { router } from "expo-router";
import { showToast } from "../constant/showToast";

const IconButton = ({ onPress, Icon, label }) => (
  <Pressable onPress={onPress} accessibilityLabel={label} >
    <Icon size={25} color="#6b7280" />
  </Pressable>
);

const PostList = ({ item }) => {
  const [showMore, setShowMore] = useState(false);

  const handleMediaUpload = (type) => {
    switch (type) {
      case "message":
        router.push(`/post/${item._id}`);
        break;
      default:
        showToast("error", "Something went wrong!");
    }
  };

  return (
    <View className="mb-3  p-2 border-b border-slate-400 ">
      {/* User Info */}
      <View className="flex-row pb-1 mb-2 gap-2">
        <Image
          source={{ uri: imagePath?.user }}
          className="h-10 w-10 rounded-full"
          resizeMode="contain"
        />

        <View className="flex-1 justify-center gap-3 ">
          <Text className="text-lg font-bold text-gray-800">
            {item?.user?.username || "Unknown"}
          </Text>
          {/* Post Content */}
          <Text className="text-gray-800">
            {showMore ? item?.content : item?.content?.slice(0, 100)}
            {item?.content?.length > 100 && (
              <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                <Text className="text-blue-500 font-semibold">
                  {showMore ? " Show Less" : " Show More"}
                </Text>
              </TouchableOpacity>
            )}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-10">
            <IconButton
              onPress={() => handleMediaUpload("heart")}
              Icon={Heart}
              label="Like"
            />
            <IconButton
              onPress={() => handleMediaUpload("message")}
              Icon={MessageCircle}
              label="Comment"
            />
            <IconButton
              onPress={() => handleMediaUpload("repeat")}
              Icon={Repeat}
              label="Share"
            />
            <IconButton
              onPress={() => handleMediaUpload("send")}
              Icon={Send}
              label="Send"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostList;
