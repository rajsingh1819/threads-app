import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import ButtonComp from "../../constant/ButtonComp";
import { FollowUser, UnfollowUser } from "../../provider/userAllApi";
import imagePath from "../../constant/imagePath";
import { Link } from "expo-router";

import {
  GlobeLock,
  Globe,
  Instagram,
  Twitter,
  AtSign,
  UserRoundCog,
  AlignRight,
} from "lucide-react-native";

const UsersList = ({ item, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  

  useEffect(() => {
    // Check if user is already following
    setIsFollowing(item?.followers?.includes(currentUser?._id));
  }, [item?.followers, currentUser?._id]);

  const handleFollow = async () => {
    try {
      const response = await FollowUser(currentUser?._id, item._id);
      if (response) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await UnfollowUser(currentUser?._id, item._id);
      if (response) {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const getFollowButtonText = () => {
    if (isFollowing) return "Following";
   if (item?.isPrivate) return "Private";

   if (item?.following?.includes(currentUser?._id)) return "Follow Back";
    return "Follow";
  };
  

  return (
    <View className="bg-gray-200 p-1 mb-3 rounded-lg flex-row items-center">
      <Link href={`/user/${item._id}`} asChild>
        <View className="flex-1 flex-row gap-1 items-center">
        <Image
            source={{ uri: item?.avatar?.cloudinary || imagePath?.user }}
            className="h-14 w-14 bg-gray-300 rounded-full"
            resizeMode="contain"
          />
        
          
          <Text className="text-black text-lg font-medium">
            {item.username}
          </Text>
        
           
        </View>
      </Link>

      <View className="w-32">
        <ButtonComp
          title={getFollowButtonText()}
          onPress={isFollowing ? handleUnfollow : handleFollow}
          style={{height:40}}
         
        />
      </View>
    </View>
  );
};

export default UsersList;
