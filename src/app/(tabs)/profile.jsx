import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../provider/auth";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GlobeLock,
  Globe,
  Instagram,
  Twitter,
  AtSign,
  UserRoundCog,
  AlignRight,
} from "lucide-react-native";
import imagePath from "../../constant/imagePath";

import ProfileAction from "../../components/profileScreen/ProfileAction";

const UserProfile = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
// console.log("user =>",user)
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch, isAuthenticated]);

  if (!user || !user._id) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
        <Text>Loading user data...</Text>
      </View>
    );
  }
  

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor="black" barStyle="light-content" />

      <View className="flex-1 p-1 mt-5">
        <View className="gap-2  p-1">
          <View className="flex-row justify-between items-center">
            {user?.isPrivate ? <GlobeLock size={35} /> : <Globe size={35} />}
            <View className="flex-row space-x-3">
              <Instagram size={30} />
              <Twitter size={30} />
              <Link href="/setting">
                <AlignRight size={30} fill="black" />
              </Link>
            </View>
          </View>

          <View className="flex flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold">
                {user?.username || "unknown"}
              </Text>
              <View className="flex-row items-center gap-1">
                <AtSign size={15} />
                <Text className="text-sm font-medium">
                  {user?.username?.toLowerCase() || "unknown"}
                </Text>
              </View>
            </View>
            <View
              className={`w-16 h-16 flex items-center justify-center ${
                !user?.image && "bg-gray-400"
              } rounded-full`}
            >
              {!user?.avatar ? (
                <UserRoundCog size={40} fill="black" />
              ) : (
                <Image
                  source={{ uri: user?.avatar || imagePath?.user }}
                  className="w-16 h-16 rounded-full"
                  resizeMode="contain"
                />
              )}
            </View>
          </View>

          <Text className="text-base font-semibold text-gray-400">
            {user?.followers?.length || "0"} followers
          </Text>

          <View className="flex-row items-center justify-center gap-2 ">
            <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
              <Text>Edit profile</Text>
            </Pressable>
            <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
              <Text>Share profile</Text>
            </Pressable>
          </View>
        </View>
        <ProfileAction user={user} />
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
