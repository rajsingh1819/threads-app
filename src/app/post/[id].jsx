import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getSinglePost } from "../../provider/userAllApi";
import { showToast } from "../../constant/showToast";

const UserPost = () => {
  const { id } = useLocalSearchParams();

  const [singlePost, setSinglPost] = useState({});
  console.log("singlePost=>", singlePost);

  // Fetch posts from the backend
  const fectchPost = async () => {
    const result = await getSinglePost({ postId: id });
    if (result.success) {
      const fetchedPost = result.data.post || {};

      // Combine new posts (at the top) with randomized existing posts
      setSinglPost(fetchedPost);
    } else {
      showToast("error", `${result.message}` || "Something went wrong");
      console.error(result.message);
    }
  };

  // Fetch posts on initial render
  useEffect(() => {
    fectchPost();
  }, []);

  if (!singlePost) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <View>
      <Text>UserPost : {id}</Text>
      <View>
      <Text>Title: {singlePost.title}</Text>
      <Text>Content: {singlePost.content}</Text>
      <Text>Author: {singlePost.user?.username}</Text>
    </View>
    </View>
  );
};

export default UserPost;
