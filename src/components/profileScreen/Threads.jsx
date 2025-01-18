import React from "react";
import { View, Text, FlatList } from "react-native";
import PostList from "../homeScreen/postList";

const Threads = ({ posts }) => {
  // console.log("posts==>",posts)
  if (!posts || posts.length === 0) {
    return (
      <View style={{ padding: 10 }}>
        <Text>No posts available.</Text>
      </View>
    );
  }

  return (
    <View className= "flex-1 mt-5">
    <FlatList
      data={posts}
      keyExtractor={(post) => post._id.toString()}
      renderItem={({ item }) => (
       
          <PostList item={item} action="post" />
       
      )}
    />
    </View>
  );
};

export default Threads;
