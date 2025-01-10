import { View, Text } from "react-native";
import React from "react";
import { logoutUser } from "../../provider/auth";
import ButtonComp from "../../constant/ButtonComp";
import { useDispatch } from "react-redux";
import { showToast } from "../../constant/showToast";
import { router } from "expo-router";


const UserLogout = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      if (result) {
        router.push("/(auth)");
        showToast("info", "User logged out successfully 🎉");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  
  return (
    <View className="bg-orange-300 mt-10">
      <ButtonComp title="Logout" onPress={handleLogout}/>
     
    </View>
  );
};

export default UserLogout;
