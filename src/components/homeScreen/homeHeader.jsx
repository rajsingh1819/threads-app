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
import AvatarView from "../../util/AvatarView";

const HomeHeader = ({ user }) => {
  return (
    <View className="p-1">
      {/* Logo */}
      <View className="flex items-center mb-1">
        <Image
          source={imagePath?.logo}
          style={{ width: 50, height: 50 }}
          className="rounded-full"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row bg-white p-1 pt-5 pb-5 gap-3 rounded-lg border border-slate-300">
       
        <AvatarView
          avatarUri={user?.avatar?.cloudinary || imagePath?.user}
          size="md"
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
    </View>
  );
};

export default HomeHeader;
