import React from "react";
import { View} from "react-native";
import PostSingleList from "./SingleList";

const UserReply = ({ reply }) => {
  return (
    <View key={reply._id} className="ml-10 mt-2">
      <PostSingleList item={reply} action="reply" />
    </View>
  );
};

export default UserReply;
