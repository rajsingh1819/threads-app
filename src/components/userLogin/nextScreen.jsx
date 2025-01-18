import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import ButtonComp from "../../constant/ButtonComp";
import { ChevronLeft, AtSign, UserRound } from "lucide-react-native";
import { showToast } from "../../constant/showToast";
import { useDispatch } from "react-redux";
import { registerUser } from "../../provider/auth";

const NextScreen = ({ userData, setUserData, setShowNextPage }) => {
  const dispatch = useDispatch();
  const goBack = () => {
    setShowNextPage(false);
    setUserData({ ...userData, username: "", password: "" });
  };

  const handleSaveUsername = () => {
    const formData = {
      username: userData.username,
      emailorphone: userData.emailorphone,
      password: userData.password,
    };

    if (!formData.emailorphone || !formData.password || !formData.username) {
      showToast("error", "Please fill the field first!");
      return;
    }
    dispatch(registerUser(formData));
    console.log("Collected Data:", userData);
    setUserData({
      username: "",
      emailorphone: "",
      password: "",
    });
    setShowNextPage(false);
  };

  return (
    <View className="flex-1 p-2">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center"
        onPress={goBack}
      >
        <ChevronLeft size={30} />
        <Text className="ml-2 text-xl">Back</Text>
      </TouchableOpacity>

      <View className="flex-1 gap-10">
        <View className="items-center gap-1">
          {!userData?.avatar ? (
            <UserRound
              size={50}
              className="h-32 w-32 rounded-full bg-slate-500 border "
            />
          ) : (
            <Image
              source={{ uri: userData.avatar }} // Add the source prop
              className="h-32 w-32 rounded-full bg-slate-500 border "
              resizeMode="contain"
            />
          )}

          <Text></Text>
          <Text className="font-bold text-base">Upload Image</Text>
        </View>

        <View className="border p-2 w-full rounded-lg bg-white">
          <View className="flex-row items-center gap-3">
            <AtSign size={30} />
            <TextInput
              placeholder="Enter your username here..."
              className="flex-1 p-2 rounded-lg text-base font-semibold"
              placeholderTextColor="gray"
              value={userData.username}
              onChangeText={(username) =>
                setUserData((prevState) => ({ ...prevState, username }))
              }
            />
          </View>
        </View>
      </View>
      <ButtonComp title="Save & Print" onPress={handleSaveUsername} />
    </View>
  );
};

export default NextScreen;
