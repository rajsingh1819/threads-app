import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "../../../components/homeScreen/homeHeader";
import { useEffect, useState } from "react";
import { getAllPost } from "../../../provider/userAllApi";
import { showToast } from "../../../constant/showToast";
import PostList from "../../../components/homeScreen/postList";
import { useSelector } from "react-redux";

const Home = () => {
  const [postData, setPostData] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fetchPost = async () => {
    const result = await getAllPost();
    if (result.success) {
      const fetchedPosts = result.data.posts || [];
      const randomizedPosts = fetchedPosts.sort(() => Math.random() - 0.5);
      // Combine new posts (at the top) with randomized existing posts
      setPostData([...randomizedPosts]);
    } else {
      showToast("error", `${result.message}` || "Something went wrong");
      console.error(result.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-1">
        <HomeHeader />
        <FlatList
          data={postData}
          keyExtractor={(item) => item.id || item._id}
          renderItem={({ item }) => (
            <PostList item={item} action="post" user={user} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
