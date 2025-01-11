import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Reply from "./reply";

const Comment = ({ comment, handleReply }) => {
  return (
    <View key={comment._id} className="mb-3">
      <Text className="font-semibold">@{comment.user?.username}</Text>
      <Text>{comment.content}</Text>
      <TouchableOpacity onPress={() => handleReply(comment)}>
        <Text className="text-blue-500">Reply</Text>
      </TouchableOpacity>

      {/* Render replies if they exist */}
      {comment.replies?.map((reply) => (
        <Reply key={reply._id} reply={reply} handleReply={handleReply} />
      ))}
    </View>
  );
};

export default Comment;
