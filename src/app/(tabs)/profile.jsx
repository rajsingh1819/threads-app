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
import { checkAuth, logoutUser } from "../../provider/auth";
import { Link } from "expo-router";
import { showToast } from "../../constant/showToast";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobeLock, Globe, Instagram, Twitter, AtSign, UserRoundCog, AlignRight } from "lucide-react-native";
import Threads from "../../components/profileScreen/Threads";
import Replies from "../../components/profileScreen/Replies";
import Reposts from "../../components/profileScreen/Reposts";
import imagePath from "../../constant/imagePath";
import { getAllPost } from "../../provider/userAllApi";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [activeScreen, setActiveScreen] = useState("Threads");
  const [postData, setPostData] = useState([]);
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  const fetchPost = async () => {
    if (!user) return false;
    try {
      const result = await getAllPost();
      console.log(" result", result);
      if (result.success) {
        setPostData(result.data.posts || []);
      } else {
        showToast("error", result.message || "Something went wrong");
        console.error(result.message);
      }
    } catch (error) {
      showToast("error", "Failed to fetch posts");
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPost();
    }
  }, [user]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch, isAuthenticated]);

  const switchScreen = (screen) => setActiveScreen(screen);

  const renderScreen = () => {
    switch (activeScreen) {
      case "Threads":
        const userThreads = postData.filter(post => post.user._id === user._id);
        return <Threads posts={userThreads} />;

      case "Replies":
        const userRepliesPosts = postData.filter(post => {
          // Check if the user has commented or replied in the post
          const userHasCommented = post.comments.some(comment => comment.user._id === user._id);
          const userHasReplied = post.comments.some(comment => 
            comment.replies.some(reply => reply.user._id === user._id)
          );
          
          return (userHasCommented || userHasReplied) && post.user._id !== user._id;
        });
        
        console.log("userRepliesPosts", userRepliesPosts);
        return <Replies posts={userRepliesPosts} user={user} />;
        
      case "Reposts":
        return <Reposts />;

      default:
        return <Threads posts={postData} />;
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor="black" barStyle='light-content' />

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
              <Text className="text-2xl font-bold">{user?.username || "unknown"}</Text>
              <View className="flex-row items-center gap-1">
                <AtSign size={15} />
                <Text className="text-sm font-medium">{user?.username?.toLowerCase() || "unknown"}</Text>
              </View>
            </View>
            <View className={`w-16 h-16 flex items-center justify-center ${!user?.image && "bg-gray-400" } rounded-full`}>
              {
                !user?.image
                  ? <UserRoundCog size={40} fill="black" />
                  : <Image source={{ uri: imagePath?.user }} className="w-16 h-16 rounded-full" resizeMode="contain" />
              }
            </View>
          </View>

          <Text className="text-base font-semibold text-gray-400">{user?.followers?.length || "0"} followers</Text>

          <View className="flex-row items-center justify-center gap-2 ">
            <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
              <Text>Edit profile</Text>
            </Pressable>
            <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
              <Text>Share profile</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row mt-3 justify-between gap-2 border-b border-slate-400">
          {["Threads", "Replies", "Reposts"].map((item, index) => (
            <Pressable
              key={index}
              onPress={() => switchScreen(item)}
              className={`flex-1 items-center p-2 ${activeScreen === item && "border-b-2 border-black"}`}
            >
              <Text className={`text-base font-semibold ${activeScreen !== item ? "text-gray-400" : "text-black"}`}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;


