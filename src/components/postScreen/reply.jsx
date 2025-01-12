import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PostList from "../postList";

const Reply = ({ reply, handleReply }) => {
  return (
    <View key={reply._id} className="ml-4 mt-2">
      <PostList  item={reply}/>
      {/* <Text className="font-semibold">@{reply.user?.username}</Text>
      <Text>{reply.content}</Text> */}
      {/* <TouchableOpacity onPress={() => handleReply(reply)}>
        <Text className="text-blue-500">Reply</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Reply;
