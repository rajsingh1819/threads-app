import React, { useEffect} from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../provider/auth";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "react-native";

import {
  GlobeLock,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  AtSign,
  AlignRight,
} from "lucide-react-native";

import ProfileAction from "../../components/profileScreen/ProfileAction";
import AvatarView from "../../util/AvatarView";
import imagePath from "../../constant/imagePath";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
};

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

  const editProfile = () => {
    if (user?._id) {
      router.push(`/user/profileChange`);
    } else {
      console.error("User ID is not available.");
    }
  };

  const openSocialLink = (url) => {
    if (url) {
      if (typeof Linking.openURL === "function") {
        Linking.openURL(url).catch((err) =>
          console.error("Failed to open URL", err)
        );
      } else {
        window.open(url, "_blank"); // For web
      }
    }
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center p-1 mt-5">
        <View className="w-full sm:w-1/2 flex-1">
          <View className="gap-2  p-1">
            <View className="flex-row justify-between items-center  mb-2">
              {user?.isPrivate ? <GlobeLock size={35} /> : <Globe size={35} />}
              <View className="flex-row space-x-3">
                {Object.entries(user?.socialLinks || {}).map(([key, value]) => {
                  if (value) {
                    // Render only if the link is not empty
                    const Icon = socialIcons[key];
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => openSocialLink(value)}
                      >
                        <Icon size={30} />
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}

                <Link href="/setting">
                  <AlignRight size={30} fill="black" />
                </Link>
              </View>
            </View>

            <View className="flex flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-bold">
                  {user?.name || `@${user?.username}` || "unknown"}
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
                <AvatarView
                  avatarUri={user?.avatar?.cloudinary || imagePath?.user}
                  size="lg"
                  currentUserId={user?._id}
                />
              </View>
            </View>

            <Text className="text-base font-semibold text-gray-400">
              {user?.followers?.length || "0"} followers
            </Text>

            <View className="flex-row items-center justify-center gap-2 ">
              <Pressable
                className="flex-1 items-center p-2 border border-black rounded-xl"
                onPress={editProfile}
              >
                <Text>Edit profile</Text>
              </Pressable>
              <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
                <Text>Share profile</Text>
              </Pressable>
            </View>
          </View>
          <ProfileAction user={user} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
