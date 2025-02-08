import { View, Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Threads from "./Threads";
import Replies from "./Replies";
import Media from "./Media";
import { showToast } from "../../constant/showToast";
import { getAllPost } from "../../provider/userAllApi";

const ProfileAction = ({ user }) => {
  const [activeScreen, setActiveScreen] = useState("Threads");
  const [postData, setPostData] = useState([]);

  const fetchPost = async () => {
    if (!user) return false;
    try {
      const result = await getAllPost();
      // console.log(" result", result);
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

  const switchScreen = (screen) => setActiveScreen(screen);

  const renderScreen = () => {
    if (!user?._id) {
      console.error("User or user ID is not available.");
      return <Text>Error: Unable to load posts</Text>;
    }
  
    switch (activeScreen) {
      case "Threads":
        const userThreads = postData.filter(
          (post) => post?.user?._id === user._id
        );
        return <Threads posts={userThreads} />;
  
      case "Replies":
        const userRepliesPosts = postData.filter((post) => {
          const userHasCommented = post?.comments?.some(
            (comment) => comment?.user?._id === user._id
          );
          const userHasReplied = post?.comments?.some((comment) =>
            comment?.replies?.some((reply) => reply?.user?._id === user._id)
          );
          return (
            (userHasCommented || userHasReplied) &&
            post?.user?._id !== user._id
          );
        });
  
       
        return <Replies posts={userRepliesPosts} user={user} />;
  
        case "Media":
          const userMediaThreads = postData.filter(
            (post) =>
              post?.user?._id === user._id && (post?.images?.cloudinary)
          );
          return <Media posts={userMediaThreads}  />;
        
  
      default:
        return <Threads post={postData}  />;
    }
  };
  

  return (
    <View className="flex-1">
      <View className="flex-row  mt-3 justify-between gap-2 border-b border-slate-400">
        {["Threads", "Replies", "Media"].map((item, index) => (
          <Pressable
            key={index}
            onPress={() => switchScreen(item)}
            className={`flex-1 items-center p-2 ${
              activeScreen === item && "border-b-2 border-black"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                activeScreen !== item ? "text-gray-400" : "text-black"
              }`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="flex-1">{renderScreen()}</View>
    </View>
  );
};

export default ProfileAction;
