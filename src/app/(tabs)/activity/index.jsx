import { Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { checkAuth } from "../../../provider/auth";
import { getAllUsers } from "../../../provider/userAllApi";
import ActiveMain from "../../../components/activeScreen/ActiveMain";

export default () => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  // Check authentication on component load
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch users when the current user is available
  const fetchUsers = async () => {
    try {
      const result = await getAllUsers(user?._id);
      if (result.success) {
        setUsers(result.data || []);
      } else {
        console.error("Error fetching users:", result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Trigger fetching users on user load
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]); // This will ensure the fetch is triggered when the user is available

  // Loading state
  if (isLoading || !user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ActiveMain users={users} currentUser={user} fetchUsers={fetchUsers} />
    </SafeAreaView>
  );
};
