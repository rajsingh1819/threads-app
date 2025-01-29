import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import UsersList from "./UsersList";
import RequestScreen from "./RequestScreen";
import Notification from "./Notification";

const ActiveMain = ({ users, currentUserId }) => {
  const [activeScreen, setActiveScreen] = useState("Users");

  // Switch button
  const switchScreen = (screen) => setActiveScreen(screen);

  // Filter users who have no follow requests
  const filteredUsers = users.filter(
    (item) =>
      item.receivedFollowRequests.length === 0 &&
      item.sentFollowRequests.length === 0
  );

  const RenderScreen = () => {
    switch (activeScreen) {
      case "Users":
        return (
          <View className="flex-1">
            {filteredUsers.length > 0 ? (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item, index) => index.toString()} // Unique key for each item
                renderItem={({ item }) => (
                  <UsersList item={item} currentUserId={currentUserId} />
                )} // Corrected `item` usage
              />
            ) : (
              <Text
                style={{ textAlign: "center", color: "gray", marginTop: 20 }}
              >
                No users found.
              </Text>
            )}
          </View>
        );
      case "Request":
        return <RequestScreen items={users} currentUserId={currentUserId} />;
      case "Notify":
        return <Notification items={users} currentUserId={currentUserId} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 justify-between p-2 mt-3 gap-3">
      <Text className="font-bold text-3xl">Active Screen</Text>
      <View className="flex-row gap-1">
        {["Users", "Request", "Notify"].map((screen, index) => (
          <TouchableOpacity
            key={index} // Added unique key for each button
            onPress={() => switchScreen(screen)}
            activeOpacity={0.7}
            className="bg-black flex-1 p-3 rounded-lg items-center"
          >
            <Text className="text-white">{screen}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <RenderScreen />
    </View>
  );
};

export default ActiveMain;
