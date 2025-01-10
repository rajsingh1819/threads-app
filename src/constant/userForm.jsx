import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Mail, Phone, KeyRound } from "lucide-react-native";
import Feather from "@expo/vector-icons/Feather";

const UserForm = ({ userData, setUserData }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Check if the input is a valid phone number or email
  const isPhone = /^\d{10}$/.test(userData.emailorphone); // 10-digit phone number validation
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailorphone); // Email validation

 
  const handleInputChange = (field, value) => {
    // If it's a phone number, only allow up to 10 digits
    if (field === "emailorphone") {
      if (isPhone && value.length <= 10) {
        setUserData(prevState => ({ ...prevState, [field]: value }));
      } else if (isEmail || !isPhone) {
        setUserData(prevState => ({ ...prevState, [field]: value }));
      }
    } else {
      // For password input, update directly
      setUserData(prevState => ({ ...prevState, [field]: value }));
    }
  };

  return (
    <View className="w-full gap-4">
      {/* Email or Phone Input */}
      <View className="border p-2 rounded-lg bg-white">
        <View className="flex-row items-center gap-3">
          {isPhone ? <Phone size={30} /> : <Mail size={30} />}
          <TextInput
            placeholder="Enter email or phone number..."
            className="flex-1 p-2 rounded-lg text-base font-semibold"
            placeholderTextColor="gray"
            value={userData.emailorphone}
            onChangeText={(value) => handleInputChange("emailorphone", value)}
            keyboardType={isPhone ? "phone-pad" : "default"}
            onFocus={() => setShowPassword(false)}
          />
        </View>
      </View>

      {/* Password Input */}
      <View className="border p-2 rounded-lg bg-white">
        <View className="flex-row items-center gap-3">
          <KeyRound size={30} />
          <TextInput
            placeholder="Enter your password..."
            className="flex-1 p-2 rounded-lg text-base font-semibold"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={userData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserForm;
