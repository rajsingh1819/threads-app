import { Image, View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react-native";
import imagePath from "../../constant/imagePath";
import { formatDistance, subDays, formatDistanceToNow } from "date-fns";

import { router } from "expo-router";

import { handleLikeToggle } from "../../util/handleIconAsction";

const PostList = ({ item, action, user }) => {
  const [showMore, setShowMore] = useState(false);
  const [userItem, setUserItem] = useState(item);

  const handleHeart = async () => {
    await handleLikeToggle(userItem, action, user, setUserItem);
  };

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

          <View className="flex-row gap-6">
            {/* Like Button */}
            <TouchableOpacity
              onPress={handleHeart}
              className="flex-row items-center"
            >
              <Heart
                size={25}
                color={
                  userItem.likes.includes(user?._id) ? "#f87171" : "#6b7280"
                }
              />
              {userItem?.likes?.length > 0 && (
                <Text className=" text-gray-800">
                  {" "}
                  {userItem?.likes?.length}
                </Text>
              )}
            </TouchableOpacity>

            {/* Message/Reply Button with Counter */}

            <TouchableOpacity
              onPress={() => router.push(`/post/${item?._id}`)}
              className="flex-row items-center"
            >
              <MessageCircle size={25} color="#6b7280" />
              {item?.comments?.length > 0 && (
                <Text className="ml-1 text-gray-800">
                  {item?.comments?.length}
                </Text>
              )}
            </TouchableOpacity>

            {/* Other Action Buttons */}
            <TouchableOpacity>
              <Repeat size={25} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Send size={25} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostList;
