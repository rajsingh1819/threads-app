import { Image, View, Text, Pressable } from "react-native";
import {
  Images,
  Camera,
  ImagePlay,
  Frame,
  Mic,
  MapPin,
} from "lucide-react-native";
import imagePath from "../../constant/imagePath";
import { router } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../provider/auth";

const HomeHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <View className="rounded-lg">
      {/* Logo */}
      <View className="flex items-center mb-3">
        <Image
          source={{ uri: imagePath?.logo }}
          className="h-16 w-16"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row  bg-white p-1 pt-5 pb-5  gap-3 rounded-lg border
       border-slate-300 ">
        {/* User Avatar */}
       
       <Image
          source={{ uri: imagePath?.user }}
          className="h-12 w-12 rounded-full"
          resizeMode="contain"
        />
      
        <Pressable className="flex-1" onPress={() => router.push("/post")}>
          <Text className="text-lg font-bold text-gray-800">
            {user?.username || "Unknown"}
          </Text>
          <Text className="text-gray-500 font-medium mt-1">What's new?</Text>
          <View className="flex-row justify-between mt-4 ">
            <Images size={28} color="#6b7280" />
            <Camera size={28} color="#6b7280" />
            <ImagePlay size={28} color="#6b7280" />
            <Mic size={28} color="#6b7280" />
            <Frame size={28} color="#6b7280" />
            <MapPin size={28} color="#6b7280" />
          </View>
        </Pressable>
      </View>

      {/* Icon Section */}
    </View>
  );
};

export default HomeHeader;
