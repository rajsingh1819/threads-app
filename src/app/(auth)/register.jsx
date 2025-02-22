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
import { MoveRight } from "lucide-react-native";
import imagePath from "../../constant/imagePath";
import NextScreen from "../../components/userLogin/nextScreen";
import { showToast } from "../../constant/showToast";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterUser = () => {
  const [showNextPage, setShowNextPage] = useState(false);
  const [userData, setUserData] = useState({
    emailorphone: "",
    password: "",
    username: "",
    avatar: "",
  });

  const goToLoginPage = () => {
    router.replace("/");
  };

  const nextPage = () => {
    if (!userData.emailorphone || !userData.password) {
      showToast("error", "Please fill in all fields first!");
      return false;
    }
    setShowNextPage(true);
  };

  return (
    <SafeAreaView className=" flex-1">
      <KeyboardAvoidingView className=" flex-1 items-center">
        <View className="w-full sm:w-1/2 flex-1 ">
          {!showNextPage && (
            <View className="items-center mt-1">
              <Image
                source={imagePath?.logo}
                className="rounded-full"
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
            </View>
          )}

          {showNextPage ? (
            <NextScreen
              userData={userData}
              setUserData={setUserData}
              setShowNextPage={setShowNextPage}
            />
          ) : (
            <View className="flex-1 justify-between p-2">
              <View className="gap-3 items-center">
                <Text className="font-bold text-xl">
                  Create Your Threads Account
                </Text>

                <UserForm userData={userData} setUserData={setUserData} />

                <Text className="text-base">
                  Have an account?{" "}
                  <TouchableOpacity activeOpacity={0.8} onPress={goToLoginPage}>
                    <Text className="text-blue-800 font-semibold">Sign In</Text>
                  </TouchableOpacity>
                </Text>
              </View>
              <ButtonComp title="Next" icon={MoveRight} onPress={nextPage} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterUser;
