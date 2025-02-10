import {
  Text,
  TextInput,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllUsers } from "../../provider/userAllApi";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../../provider/auth";
import imagePath from "../../constant/imagePath";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import the search icon

export default function UserSearch() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]); // Initially empty
  const [isFocused, setIsFocused] = useState(false); // Track if input is focused

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers(user?._id);
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  if (!user?._id) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  const handleSearch = (text) => {
    setSearch(text);

    // Hide results if only '@' is typed
    if (text.trim() === "@" || text.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const cleanText = text.startsWith("@") ? text.slice(1) : text; // Remove '@' if present

    const filtered = users.filter((u) =>
      u.username.toLowerCase().includes(cleanText.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  return (
    <SafeAreaView className="items-center">
      <View className="p-2 w-full sm:w-1/2">
        <Text className="text-2xl font-bold mb-2 text-center">
          Search Users
        </Text>
        <View
          className={`flex-row items-center p-1 rounded-lg mb-4  ${
            !isFocused && "border "
          }`}
        >
          {/* Show the search icon only when search input is empty and not focused */}
          {search.trim() === "" && !isFocused && (
            <TouchableOpacity className="mr-2">
              <Ionicons name="search" size={24} color="gray" />
            </TouchableOpacity>
          )}

          <TextInput
            className={`flex-1 p-3 rounded-lg  ${isFocused && "border"}`}
            placeholder="Search by username (@username supported)"
            placeholderTextColor="gray"
            value={search}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)} // Input focused
            onBlur={() => setIsFocused(false)} // Input blurred
          />
        </View>

        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="p-2 border-b-2 border-gray-300">
                <TouchableOpacity
                  className="flex-row items-center gap-2 pb-1"
                  onPress={() => router.push(`/user/${item?._id}`)}
                >
                  <Image
                    source={{
                      uri: item?.avatar?.cloudinary || imagePath?.user,
                    }}
                    className="h-10 w-10 rounded-full"
                    resizeMode="contain"
                  />
                  <Text className="text-lg">{item.username}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : search.length > 1 ? (
          <Text className="text-center mt-4">No users found</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
