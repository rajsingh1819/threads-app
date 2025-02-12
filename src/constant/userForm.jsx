import React, { useState} from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const UserForm = ({ userData, setUserData }) => {
  const [showPassword, setShowPassword] = useState(false);


  const isPhone = /^\d{10}$/.test(userData.emailorphone); // 10-digit phone number validation
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailorphone); // Email validation

  const handleInputChange = (field, value) => {
   
    if (field === "emailorphone") {
      if (isPhone && value.length <= 10) {
        setUserData((prevState) => ({ ...prevState, [field]: value }));
      } else if (isEmail || !isPhone) {
        setUserData((prevState) => ({ ...prevState, [field]: value }));
      }
    } else {
      // For password input, update directly
      setUserData((prevState) => ({ ...prevState, [field]: value }));
    }
  };

  return (
    <View className="w-full gap-4 ">
      {/* Email or Phone Input */}

      <TextInput
        placeholder="Enter email or phone number..."
        className="flex-1 p-3 rounded-lg text-base font-semibold border"
        placeholderTextColor="gray"
        value={userData.emailorphone}
        onChangeText={(value) => handleInputChange("emailorphone", value)}
        keyboardType={isPhone ? "phone-pad" : "default"}
        onFocus={() => setShowPassword(false)}
      />

      {/* Password Input */}

      <View className="relative">
        <TextInput
          placeholder="Enter your password..."
          className="flex-1 p-3 border rounded-lg text-base font-semibold"
          placeholderTextColor="gray"
          secureTextEntry={!showPassword}
          value={userData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});




