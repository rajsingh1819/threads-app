import { Image, View, Text, Pressable, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react-native";
import imagePath from "../constant/imagePath";
import { formatDistance, subDays, formatDistanceToNow } from "date-fns";

const IconButton = ({ onPress, Icon, label }) => (
  <Pressable onPress={onPress} accessibilityLabel={label}>
    <Icon size={25} color="#6b7280" />
  </Pressable>
);

const PostList = ({ item, handleMediaUpload }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <View className="p-2 border-b-2 border-slate-400 ">
      {/* User Info */}
      <View className="flex-row pb-1 mb-2 gap-2">
        <Image
          source={{ uri: item?.avatar || imagePath?.user }}
          className="h-10 w-10 rounded-full"
          resizeMode="contain"
        />
        <View className="flex-1 justify-center gap-3 ">
          <View className="flex-row gap-3 items-center justify-between">
            <Text className="text-lg font-bold text-gray-800">
              {item?.user?.username || "Unknown"}
            </Text>
            <Text className="text-slate-800">
              {formatDistanceToNow(new Date(item?.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </View>
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
          {
            handleMediaUpload && <View className="flex-row gap-10">
            <IconButton
              onPress={() => handleMediaUpload("heart", item)}
              Icon={Heart}
              label="Like"
            />
            <IconButton
              onPress={() => handleMediaUpload("message", item)}
              Icon={MessageCircle}
              label="Comment"
            />
            <IconButton
              onPress={() => handleMediaUpload("repeat", item)}
              Icon={Repeat}
              label="Share"
            />
            <IconButton
              onPress={() => handleMediaUpload("send", item)}
              Icon={Send}
              label="Send"
            />
          </View>
          }
         
        </View>
      </View>
    </View>
  );
};


export default PostList;
