import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Reply from "./reply";
import PostList from "../postList";

const Comment = ({ comment, handleReply, handleMediaUpload }) => {
  const [showView, setShowView] = useState(false);

  return (
    <View key={comment._id} className="mb-3 ">
      <PostList item={comment} handleMediaUpload={handleMediaUpload} />
      <View className="flex-row gap-3">
        <TouchableOpacity onPress={() => handleReply(comment)}>
          <Text className="text-blue-500">Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowView(!showView)}>
          {!showView ? (
            <Text className="text-blue-500">Show</Text>
          ) : (
            <Text className="text-blue-500">Hide</Text>
          )}
        </TouchableOpacity>
      </View>
      {showView &&
        comment.replies?.map((reply) => (
          <Reply key={reply._id} reply={reply} handleReply={handleReply} />
        ))}
    </View>
  );
};

export default Comment;
