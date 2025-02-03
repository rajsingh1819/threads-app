import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import ButtonComp from "../../constant/ButtonComp";
import { FollowUser, UnfollowUser } from "../../provider/userAllApi";
import imagePath from "../../constant/imagePath";
import { Link } from "expo-router";

const UsersList = ({ item, currentUser, fetchUser }) => { // Add fetchUser to props
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  // useEffect(()=>{
  //   fetchUser()
  // },[])

  useEffect(() => {
    setIsFollowing(item?.followers?.includes(currentUser?._id));
    setIsRequested(item?.receivedFollowRequests?.includes(currentUser?._id));
  }, [item?.followers, item?.receivedFollowRequests, currentUser?._id]);

  const handleFollow = async () => {
    try {
      const response = await FollowUser(currentUser?._id, item._id);
      if (response) {
        if (item?.isPrivate) {
          setIsRequested(true);
        } else {
          setIsFollowing(true);
        }
        fetchUser(); // Fetch updated user data
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
        setIsRequested(false);
        fetchUser(); // Fetch updated user data
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };


  const getFollowButtonText = () => {
    if (isRequested) return "Requested";
    if (isFollowing) return "Following";
    if (item?.following?.includes(currentUser?._id)) return "Follow Back";
    return "Follow";
  };

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
            {item.username}
          </Text>
        </View>
      </Link>

      <View className="w-32">
        <ButtonComp
          title={getFollowButtonText()}
          onPress={isFollowing || isRequested ? handleUnfollow : handleFollow}
          style={{ height: 40 }}
        />
      </View>
    </View>
  );
};

export default UsersList;
