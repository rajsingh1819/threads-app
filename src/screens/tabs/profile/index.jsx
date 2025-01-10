import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator, Pressable, TouchableHighlight } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logoutUser } from "../../../provider/auth";
import { Link, router } from "expo-router";
import { showToast } from "../../../constant/showToast";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonComp from "../../../constant/ButtonComp";
import {
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
} from "lucide-react-native";
import Threads from "../../../components/profileScreen/Threads";
import Replies from "../../../components/profileScreen/Replies";
import Reposts from "../../../components/profileScreen/Reposts";
import imagePath from "../../../constant/imagePath";

{
  /* <AlignRight />  <AtSign /> <BadgeCheck /> <DollarSign /> <Expand /> <Globe /> 
  <GlobeLock /> <IndianRupee />
  <Instagram /> <ShieldAlert <UserRoundCog /> <UserCog /> <Twitter /> />
  */
}


const UserProfile = () => {
  const [ activeScreen, setActiveScreen] = useState("Threads");
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  const size = 35;
 

  useEffect(() => {
   
        dispatch(checkAuth()); 
     
  }, [dispatch, isAuthenticated]); 

  

  

  const switchScreen = (screen) => {
    setActiveScreen(screen);
  };
  const renderScreen = () => {
    switch ( activeScreen) {
      case "Threads":
        return <Threads />;
      case "Replies":
        return <Replies />;
      case "Reposts":
        return <Reposts />;
      default:
        return <Threads />;
    }
  };
  


  return (
    <SafeAreaView className="flex-1 mt-10">
    <View className="flex-1 p-1">
      <View className="gap-2  p-1">
        {/* Top Section */}
        <View className="flex-row  justify-between items-center">
          {
            user?.isPrivate ? <GlobeLock size={size} />      :<Globe size={size} />

          }
          
          <View className="flex-row space-x-3">
            <Instagram size={size} />
            <Twitter size={size} />
            
              <Link href="/setting">
              <AlignRight size={size} fill="black"  />
              </Link>
            
          
          </View>
        </View>
  
        {/* User Info */}
        <View className="flex flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold">{user?.username || "unknown"}</Text>
            <View className="flex-row items-center gap-1">
              <AtSign size={15} />
              <Text className="text-sm font-medium">{user?.username?.toLowerCase() || "unknown"}</Text>
            </View>
          </View>
          <View className={`w-16 h-16 flex items-center justify-center ${!user?.image && "bg-gray-400" } rounded-full`}>
            {
              !user?.image
                ? <UserRoundCog size={40} fill="black" />
                : <Image source={{ uri: imagePath?.user }} className="w-16 h-16 rounded-full" resizeMode="contain" />
            }
          </View>
        </View>
  
        {/* Followers */}
        <Text className="text-base font-semibold text-gray-400">{user?.followers?.length || "0"} followers</Text>
  
        {/* Buttons */}
        <View className="flex-row items-center justify-center gap-2 ">
          <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
            <Text>Edit profile</Text>
          </Pressable>
          <Pressable className="flex-1 items-center p-2 border border-black rounded-xl">
            <Text>Share profile</Text>
          </Pressable>
        </View>
      </View>
  
      {/* Navigation Tabs */}
      <View className="flex-row mt-3 justify-between gap-2 border-b border-slate-400">
        {["Threads", "Replies", "Reposts"].map((item, index) => (
          <Pressable
            key={index}
            onPress={() => switchScreen(item)}
            className={`flex-1 items-center p-2 ${activeScreen === item && "border-b-2 border-black" }`}
          >
            <Text className={`text-base font-semibold ${activeScreen !== item ? "text-gray-400" : "text-black"}`}>{item}</Text>
          </Pressable>
        ))}
      </View>
  
      {/* Render Content Based on Active Tab */}
      {renderScreen()}
    </View>
  </SafeAreaView>
  
  
  );
};

export default UserProfile;

/*
  {isAuthenticated && (
        <View className="flex-1 p-2 ">
          <View className="bg-orange-300">
            <View className="flex-1 p-1 gap-5 ">
              <View className="flex-row justify-between">
                <View className="flex-row gap-2">
                  <Text className="text-2xl font-semibold">
                    @{user?.username}
                  </Text>
                  {user?.isPrivate && <LockIcon size={30} />}
                </View>
                <Pressable onPress={goToSetting }>
                  <Settings size={30} />
                </Pressable>
              </View>

              <View className="flex-row gap-3">
                <Image
                  className="h-20 w-20 rounded-full"
                  resizeMode="contain"
                  source={{
                    uri:
                      user?.avatar ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
                <View>
                  <Text className="text-base">BTech.</Text>
                  <Text className="text-base">Movie Buff | Musical Nerd</Text>
                  <Text className="text-base">Love Yourself</Text>
                </View>
              </View>

              <Text className="text-lg mt-2">
                {user?.following?.length || 0} Following
              </Text>

              <View className="flex-row gap-2 w-full">
                <View className="w-1/2">
                  <ButtonComp title="Edit Profile" />
                </View>
                <View className="w-1/2">
                  <ButtonComp title="Logout" onPress={handleLogout} />
                </View>
              </View>
            </View>
          </View>

          {user?._id === user?._id ? (
            <View className=" flex-1 flex-row justify-between mt-4 bg-green-300">
              <Text className="text-lg font-semibold">Short</Text>
              <Text className="text-lg font-semibold">Feed</Text>
              <Text className="text-lg font-semibold">Tag</Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center mt-8">
              <MaterialIcons name="privacy-tip" size={150} color="gray" />
              <Text className="text-lg mt-4">Account is Private</Text>
            </View>
          )}
        </View>
      )}


*/
