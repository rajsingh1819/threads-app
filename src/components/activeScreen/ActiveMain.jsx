import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import UsersList from "./UsersList";
import RequestScreen from "./RequestScreen";
import Notification from "./Notification";

const ActiveMain = ({ users, currentUser, fetchUsers }) => {
  const [activeScreen, setActiveScreen] = useState("Users");

  // Switch button
  const switchScreen = (screen) => setActiveScreen(screen);

  const RenderScreen = () => {
    switch (activeScreen) {
      case "Users":
        const filteredUsers = users.filter(
          (user) =>
            !user.receivedFollowRequests?.includes(currentUser?._id) &&
            !user.sentFollowRequests?.includes(currentUser?._id) && user?.followers?.length>=2
        );

        return (
          <View className="flex-1">
            {filteredUsers?.length > 0 ? (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item, index) => index.toString()} // Unique key for each item
                renderItem={({ item }) => (
                  <UsersList
                    item={item}
                    currentUser={currentUser}
                    fetchUser={fetchUsers}
                  />
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

      case "Request":
        const filteredRequestUsers = users.filter(
          (user) =>
            user.sentFollowRequests?.includes(currentUser?._id) ||
            user.receivedFollowRequests?.includes(currentUser?._id)
        );

        return (
          <View className="flex-1">
            {filteredRequestUsers?.length > 0 ? (
              <FlatList
                data={filteredRequestUsers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <RequestScreen
                    item={item}
                    currentUser={currentUser}
                    fetchUser={fetchUsers}
                  />
                )}
              />
            ) : (
              <Text
                style={{ textAlign: "center", color: "gray", marginTop: 20 }}
              >
                No request found.
              </Text>
            )}
          </View>
        );

      case "Notify":
        return (
          <View className="flex-1">
            {currentUser?.followers && currentUser.followers.length > 0 ? (
              <FlatList
                data={currentUser.followers}
                keyExtractor={(item) => item._id || item} // Handle both populated & non-populated cases
                renderItem={({ item }) => <Notification item={item} />}
              />
            ) : (
              <Text className="text-center text-gray-500 mt-5">
                No followers found.
              </Text>
            )}
          </View>
        );

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
