import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import ButtonComp from "../../constant/ButtonComp";
import { FollowUser, UnfollowUser } from "../../provider/userAllApi";
import imagePath from "../../constant/imagePath";
import { Link } from "expo-router";

const UsersList = ({ item, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if user is already following
  // console.log("response item==>", item);

  useEffect(() => {
    if (item?.followers?.includes(currentUserId)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [item?.followers, currentUserId]);

  const handleFollow = async () => {
    try {
      const response = await FollowUser(currentUserId, item._id);
      if (response) {
        console.log("response follow==>", response);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await UnfollowUser(currentUserId, item._id);
      if (response) {
        console.log("response unfollow ==>", response);

        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <View className="bg-orange-300 p-2 mb-3 rounded-lg flex-row items-center">
      <Link
        href={ `/user/${item._id}`}
        asChild
      >
        <View className="flex-1 flex-row gap-1 items-center">
          <Image
            source={{ uri: item?.avatar?.cloudinary || imagePath?.user }}
            className="h-12 w-12 bg-gray-300 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-black text-lg font-medium">
            {item.username}
          </Text>
        </View>
      </Link>

      <View className="w-32">
        <ButtonComp
          title={isFollowing ? "Following" : "Follow"}
          onPress={isFollowing ? handleUnfollow : handleFollow}
        />
      </View>
    </View>
  );
};

export default UsersList;
