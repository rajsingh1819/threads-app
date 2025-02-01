import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import UsersList from "./UsersList";
import RequestScreen from "./RequestScreen";
import Notification from "./Notification";

const ActiveMain = ({ users, currentUser }) => {
  const [activeScreen, setActiveScreen] = useState("Users");

  // Switch button
  const switchScreen = (screen) => setActiveScreen(screen);

  // Filter users who have no follow requests

  const RenderScreen = () => {
    switch (activeScreen) {
      case "Users":
        // ✅ Exclude users who sent a request to currentUser (shown in "Request" screen)
        const filteredUsers = users.filter(
          (user) =>
            !user.receivedFollowRequests?.includes(currentUser?._id) && 
            !user.sentFollowRequests?.includes(currentUser?._id) 
        );
      
        return (
          <View className="flex-1">
            {filteredUsers?.length > 0 ? (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item, index) => index.toString()} // Unique key for each item
                renderItem={({ item }) => (
                  <UsersList item={item} currentUser={currentUser} />
                )}
              />
            ) : (
              <Text style={{ textAlign: "center", color: "gray", marginTop: 20 }}>
                No users found.
              </Text>
            )}
          </View>
        );
      
      case "Request":
        const filteredRequestUsers = users.filter((user) =>
          user.sentFollowRequests?.includes(currentUser?._id) ||
           user.receivedFollowRequests?.includes(currentUser?._id)
        );

         // ✅ Only show users who sent a follow request to the current user
  // const filteredRequestUsers = users.filter((user) =>
  //   user.receivedFollowRequests?.includes(currentUser?._id)
  // );

        return (
          <View className="flex-1">
            {filteredRequestUsers?.length > 0 ? (
              <FlatList
                data={filteredRequestUsers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <RequestScreen item={item} currentUser={currentUser} />
                )}
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

      case "Notify":
        return <Notification items={users} currentUser={currentUser} />;
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
