import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PostSingleList from "./singleList";


const Reply = ({ reply, handleReply,handleMediaUpload }) => {
  return (
    <View key={reply._id} className="ml-10 mt-2">

    <PostSingleList item={reply} action="reply"/>
      {/* <Text className="font-semibold">@{reply.user?.username}</Text>
      <Text>{reply.content}</Text> */}
      {/* <TouchableOpacity onPress={() => handleReply(reply)}>
        <Text className="text-blue-500">Reply</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Reply;
