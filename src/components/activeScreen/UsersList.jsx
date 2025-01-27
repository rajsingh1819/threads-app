import { View, Text } from "react-native";
import React from "react";

const UsersList = ({ items }) => {
  return (
    <View className="flex-1 bg-orange-300">
      {items.map((u) => (
        <Text key={u._id}>{u.username}</Text>
      ))}
    </View>
  );
};

export default UsersList;
