import React, { useState } from "react";
import { Image, View, Text, TouchableOpacity, Pressable } from "react-native";
import {
  Heart,
  MessageCircle,
  Repeat,
  Send,
  Ellipsis,
} from "lucide-react-native";
import imagePath from "../../constant/imagePath";
import { formatDistanceToNow } from "date-fns";
import { handleLikeToggle } from "../../util/handleIconAction";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import ImageView from "../../util/ImageView";


const PostSingleList = ({ item, onMessageIconPress, action }) => {
  const { user } = useSelector((state) => state.auth);
  const [showMore, setShowMore] = useState(false);
  const [postItem, setPostItem] = useState(item);
 

  const isLiked = postItem?.likes?.includes(user?._id);
  const result =
    action === "post"
      ? postItem?.comments?.length || 0
      : postItem?.replies?.length || 0;

  // api
  const handleHeart = async () => {
    await handleLikeToggle(postItem, action, user, setPostItem);
  };

  return (
    <View className="p-2">
      <View className="flex-row pb-1 gap-2">
        {/* User Avatar */}
        <TouchableOpacity
          className="h-10 w-10"
          onPress={() =>
            user?._id === postItem?.user?._id
              ? router.push("/profile")
              : router.push(`/user/${postItem?.user?._id}`)
          }
        >
          <Image
            source={{
              uri: postItem?.user?.avatar?.cloudinary || imagePath?.user,
            }}
            className="h-10 w-10 rounded-full"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View className="flex-1 justify-center gap-3">
          {/* User Info */}
          <View className="flex-row gap-3 items-center">
            <View className="flex-1 ">
              <TouchableOpacity
                onPress={() =>
                  user?._id === postItem?.user?._id
                    ? router.push("/profile")
                    : router.push(`/user/${postItem?.user?._id}`)
                }
              >
                <Text className="text-lg font-bold text-gray-800">
                  {postItem?.user?.username || "Unknown"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-2">
              <Text className="text-slate-800">
                {formatDistanceToNow(new Date(postItem?.createdAt), {
                  addSuffix: true,
                })}
              </Text>
              {user?._id === postItem?.user?._id && (
                <TouchableOpacity>
                  <Ellipsis size={25} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Post Content */}
          <View className="gap-3">
            <Text className="text-gray-800">
              {showMore ? postItem?.content : postItem?.content?.slice(0, 100)}
              {postItem?.content?.length > 100 && (
                <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                  <Text className="text-blue-500 font-semibold">
                    {showMore ? " Show Less" : " Show More"}
                  </Text>
                </TouchableOpacity>
              )}
            </Text>

            {postItem?.images?.cloudinary && (
              
             <ImageView imageUri={postItem?.images?.cloudinary} className="w-36 h-32 rounded-lg" />

            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-6 mt-2">
            {/* Like/Unlike Button */}
            <TouchableOpacity
              onPress={handleHeart}
              className="flex-row items-center"
            >
              <Heart
                size={25}
                color={isLiked ? "#f87171" : "#6b7280"}
                fill={isLiked ? "#f87171" : "white"}
              />
              {postItem?.likes?.length > 0 && (
                <Text className="text-gray-800 ml-1">
                  {postItem?.likes?.length}
                </Text>
              )}
            </TouchableOpacity>

            {/* Message Button */}
            {action === "reply" ? null : (
              <TouchableOpacity
                onPress={onMessageIconPress}
                className="flex-row items-center"
              >
                <MessageCircle size={25} color="#6b7280" />
                {result > 0 && (
                  <Text className="ml-1 text-gray-800">{result}</Text>
                )}
              </TouchableOpacity>
            )}

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
