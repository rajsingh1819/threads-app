import React, { useState, useEffect } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Heart, MessageCircle, Repeat, Send } from "lucide-react-native";
import imagePath from "../../constant/imagePath";
import { formatDistanceToNow } from "date-fns";
import { handleLikeToggle } from "../../util/handleIconAsction";

const PostSingleList = ({ item, onMessageIconPress, action, user }) => {
  const [showMore, setShowMore] = useState(false);
  const [userItem, setUserItem] = useState(item);
  // console.log(user)

  const result =
    action === "post"
      ? item?.comments?.length || 0
      : item?.replies?.length || 0;

  const handleHeart = async () => {
    await handleLikeToggle(userItem, action, user, setUserItem);
  };

  return (
    <View className="p-2 border-b-2 border-slate-400">
      <View className="flex-row pb-1 mb-2 gap-2">
        <Image
          source={{ uri: userItem?.avatar || imagePath?.user }}
          className="h-10 w-10 rounded-full"
          resizeMode="contain"
        />
        <View className="flex-1 justify-center gap-3">
          <View className="flex-row gap-3 items-center justify-between">
            <Text className="text-lg font-bold text-gray-800">
              {userItem?.user?.username || "Unknown"}
            </Text>
            <Text className="text-slate-800">
              {formatDistanceToNow(new Date(userItem?.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </View>

          <Text className="text-gray-800">
            {showMore ? userItem?.content : userItem?.content?.slice(0, 100)}
            {userItem?.content?.length > 100 && (
              <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                <Text className="text-blue-500 font-semibold">
                  {showMore ? " Show Less" : " Show More"}
                </Text>
              </TouchableOpacity>
            )}
          </Text>

          <View className="flex-row gap-6 mt-2">
            {/* Like/Unlike Button */}
            <TouchableOpacity onPress={handleHeart}  className="flex-row items-center">
              <Heart
                size={25}
                color={
                  userItem.likes.includes(user?._id) ? "#f87171" : "#6b7280"
                }
              />
          {
            userItem?.likes?.length>0 && <Text className=" text-gray-800"> {userItem?.likes?.length}</Text> 
          }   
            </TouchableOpacity>

            {/* Message Button */}
            <TouchableOpacity
              onPress={onMessageIconPress}
              className="flex-row items-center"
            >
              <MessageCircle size={25} color="#6b7280" />
              {result > 0 && (
                <Text className="ml-1 text-gray-800">{result}</Text>
              )}
            </TouchableOpacity>

            {/* Repeat Button */}
            <TouchableOpacity>
              <Repeat size={25} color="#6b7280" />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity>
              <Send size={25} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostSingleList;
