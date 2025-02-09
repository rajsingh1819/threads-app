import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import UserForm from "../../constant/userForm";
import ButtonComp from "../../constant/ButtonComp";
import imagePath from "../../constant/imagePath";
import { showToast } from "../../constant/showToast";
import { useDispatch } from "react-redux";
import { loginUser } from "../../provider/auth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginUser = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    emailorphone: "",
    password: "",
  });

  const goToRegisterPage = () => {
    router.push("/(auth)/register");
    //   setIsLogin(false);
  };

  const loginSubmit = async () => {
    const formData = {
      emailorphone: userData.emailorphone,
      password: userData.password,
    };

    if (!formData.emailorphone || !formData.password) {
      showToast("error", "Please fill in all fields first!");
      return;
    }

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log("Login Success:", result);
      // result && userProfile(user?.token);
      router.push("/(tabs)"); // Navigate to the main screen after login
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  function ForgotPassword() {
    router.push("/forgot");
  }
  return (
    <SafeAreaView className=" flex-1 ">
      <KeyboardAvoidingView className="flex-1 items-center">
        <View className=" w-full sm:w-1/2 flex-1 ">
          <View className="items-center ">
            <Image
              source={{ uri: imagePath.logo }}
              className="h-20 w-20 rounded-full"
              resizeMode="contain"
            />
          </View>
          <View className="flex-1 justify-between p-2">
            <View className="gap-3 items-center">
              <Text className="font-bold text-xl"> Welcome to Threads </Text>

              {/* user input */}
              <UserForm userData={userData} setUserData={setUserData} />
              <View className="text-center">
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="items-center"
                  onPress={ForgotPassword}
                >
                  <Text className="text-blue-800 text-base">
                    Forgot password?
                  </Text>
                </TouchableOpacity>

                <Text className="text-base">
                  Doesn't have an account?{" "}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={goToRegisterPage}
                  >
                    <Text className="text-blue-800 font-semibold">Sign Up</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
            <ButtonComp title="Sign In" onPress={loginSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginUser;
