import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";
import * as Linking from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../provider/auth";
import { showToast } from "../../constant/showToast";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LockIcon,
  GlobeLock,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  LogOut,
} from "lucide-react-native";
import imagePath from "../../constant/imagePath";
import {
  singleUser,
  UnfollowUser,
  FollowUser,
} from "../../provider/userAllApi";
import ProfileAction from "../../components/profileScreen/ProfileAction";
import HeaderBack from "../../constant/HeaderBack";
import AvatarView from "../../util/AvatarView";
import userLogout from "../../util/userLogout";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
};

const User = () => {
  const { id } = useLocalSearchParams();
  const handleLogout = userLogout();
  const [userDetails, setUserDetails] = useState(null);
  const [isRequested, setIsRequested] = useState(false);

  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch User Details
  const fetchUser = useCallback(async () => {
    try {
      const result = await singleUser(id);
      if (result?.success) {
        setUserDetails(result?.user || {});
        setIsRequested(
          result.user?.receivedFollowRequests?.includes(user?._id) || false
        );
      } else {
        showToast("error", result.message || "Something went wrong");
      }
    } catch (error) {
      showToast("error", "Failed to fetch user data.");
    }
  }, [id, user?._id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!user || !userDetails?._id) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  // Navigate back
  const handleBackPress = () => {
    router.canGoBack() ? router.back() : router.push("/(tabs)");
  };

  // Handle Follow Action
  const handleFollow = async () => {
    try {
      const result = await FollowUser(user._id, userDetails._id);
      if (result) {
        if (userDetails?.isPrivate) {
          setIsRequested(true);
          showToast("success", "Follow request sent!");
        } else {
          showToast("success", "Followed successfully!");
        }
        fetchUser();
      }
    } catch (error) {
      showToast("error", "Failed to follow the user.");
    }
  };

  // Handle Unfollow Action
  const handleUnfollow = async () => {
    try {
      const result = await UnfollowUser(user._id, userDetails._id);
      if (result) {
        setIsRequested(false);
        showToast(
          "success",
          isRequested ? "Follow request canceled!" : "Unfollowed successfully!"
        );
        fetchUser();
      }
    } catch (error) {
      showToast("error", "Failed to update follow status.");
    }
  };

  const isFollowing = userDetails?.followers?.some(
    (follower) => String(follower._id) === String(user._id)
  );

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
      <View className="flex-1 items-center mt-2">
        <View className="w-full sm:w-1/2 flex-1">
          <HeaderBack onPress={handleBackPress} />

          <View className="flex-1 p-2">
            {/* Header Section */}
            <View className="gap-2 p-1">
              <View className="flex-row justify-between items-center mb-2">
                {userDetails?.isPrivate ? (
                  <GlobeLock size={35} />
                ) : (
                  <Globe size={35} />
                )}
                <View className="flex-row space-x-3">
                  {Object.entries(userDetails?.socialLinks || {}).map(
                    ([key, value]) => {
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
                    }
                  )}
                  <TouchableOpacity onPress={handleLogout}>
                    <LogOut size={35} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* User Info Section */}
              <View className="flex flex-row justify-between items-center">
                <View>
                  <Text className="text-2xl font-bold">
                    {userDetails?.name || `@${userDetails?.username}` || "Unknown"}
                  </Text>
                  <Text className="text-sm font-medium text-gray-500">
                    @{userDetails?.username?.toLowerCase() || "unknown"}
                  </Text>
                </View>
                <View
                  className={`w-16 h-16 flex items-center justify-center ${
                    !userDetails?.avatar && "bg-gray-400"
                  } rounded-full`}
                >
                  <AvatarView
                    avatarUri={
                      userDetails?.avatar?.cloudinary || imagePath?.user
                    }
                    size="lg"
                  />
                </View>
              </View>

              {/* Followers Count */}
              <Text className="text-base font-semibold text-gray-400">
                {userDetails?.followers?.length || "0"} followers
              </Text>

              {/* Follow & Share Buttons */}
              <View className="flex-row items-center justify-center gap-2">
                {isFollowing ? (
                  <Pressable
                    onPress={handleUnfollow}
                    className="flex-1 items-center p-2 border border-black rounded-xl"
                  >
                    <Text>Following</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={isRequested ? handleUnfollow : handleFollow}
                    className="flex-1 items-center p-2 border border-black rounded-xl"
                  >
                    <Text>{isRequested ? "Cancel Request" : "Follow"}</Text>
                  </Pressable>
                )}

                <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
                  <Text>Share</Text>
                </Pressable>
              </View>
            </View>

            {/* Show Profile Content or Lock Icon for Private Accounts */}
            {userDetails?.isPrivate && !isFollowing ? (
              <View className="flex-1 items-center justify-center">
                <LockIcon size={200} />
                <Text className="text-lg font-semibold mt-2">
                  This account is private
                </Text>
              </View>
            ) : (
              <ProfileAction user={userDetails} />
            )}
          </View>
        </View>
      </View>

      {/* Back Button */}
    </SafeAreaView>
  );
};

export default User;
