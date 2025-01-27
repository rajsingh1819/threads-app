import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logoutUser } from "../../provider/auth";
import { Link, router } from "expo-router";
import { showToast } from "../../constant/showToast";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonComp from "../../constant/ButtonComp";
import {
  ChevronLeft,
  Settings,
  Lock,
  LockIcon,
  AlignRight,
  GlobeLock,
  AtSign,
  BadgeCheck,
  DollarSign,
  Globe,
  Instagram,
  Twitter,
  UserRoundCog,
  UserCog,
  EllipsisVertical,
} from "lucide-react-native";
import Threads from "../../components/profileScreen/Threads";
import Replies from "../../components/profileScreen/Replies";
import Reposts from "../../components/profileScreen/Reposts";
import imagePath from "../../constant/imagePath";
import { singleUser } from "../../provider/userAllApi";
import ProfileAction from "../../components/profileScreen/ProfileAction";

{
  /* <AlignRight />  <AtSign /> <BadgeCheck /> <DollarSign /> <Expand /> <Globe /> 
  <GlobeLock /> <IndianRupee />
  <Instagram /> <ShieldAlert <UserRoundCog /> <UserCog /> <Twitter /> />
  */
}
const User = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null); // Initialize user as null
 

  const fetchUser = async () => {
    const result = await singleUser(id);
    if (result.success) {
      const fetchedUser = result?.user || {};
      console.log("result", result);
      setUser(fetchedUser); // Set user after fetching
    } else {
      showToast("error", `${result.message}` || "Something went wrong");
      console.error(result.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

   if (!user || !user._id) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={30} />
          <Text>Loading user data...</Text>
        </View>
      );
    }
    

  
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  return (
    <SafeAreaView className="flex-1 mt-5">
      <TouchableOpacity className="flex-row" onPress={handleBackPress}>
        <ChevronLeft size={25} color="#000" />
        <Text className="text-base font-semibold"> Back</Text>
      </TouchableOpacity>
      <View className="flex-1 p-1 mt-2">
        <View className="gap-2 p-1">
          {/* Top Section */}
          <View className="flex-row justify-between items-center">
            {user?.isPrivate ? <GlobeLock size={35} /> : <Globe size={35} />}

            <View className="flex-row space-x-3">
              <Instagram size={30} />
              <Twitter size={30} />

              <EllipsisVertical size={30} fill="black" />
            </View>
          </View>

          {/* User Info */}
          <View className="flex flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold">
                {user?.username || "unknown"}
              </Text>
              <View className="flex-row items-center gap-1">
                <AtSign size={15} />
                <Text className="text-sm font-medium">
                  {user?.username?.toLowerCase() || "unknown"}
                </Text>
              </View>
            </View>
            <View
              className={`w-16 h-16 flex items-center justify-center ${
                !user?.image && "bg-gray-400"
              } rounded-full`}
            >
              {!user?.avatar ? (
                <UserRoundCog size={40} fill="black" />
              ) : (
                <Image
                  source={{ uri: user?.avatar?.cloudinary || imagePath?.user }}
                  className="w-16 h-16 rounded-full"
                  resizeMode="contain"
                />
              )}
            </View>
          </View>

          {/* Followers */}
          <Text className="text-base font-semibold text-gray-400">
            {user?.followers?.length || "0"} followers
          </Text>

          {/* Buttons */}
          <View className="flex-row items-center justify-center gap-2 ">
            <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
              <Text>follow</Text>
            </Pressable>
            <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
              <Text>Share </Text>
            </Pressable>
          </View>
        </View>

        {/* Navigation Tabs */}

        {/* {
          
     user?.isPrivate &&
        } */}

        {user?.isPrivate ? (
          <View className=" flex-1 items-center justify-center">
            <Text>
            <LockIcon size={200} />
            </Text>
          </View>
        ) : (
         
          <ProfileAction user={user}/>
         
        )}
      </View>
    </SafeAreaView>
  );
};

export default User;
