import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { getAllPost } from "../../../provider/userAllApi";
import { showToast } from "../../../constant/showToast";
import HomeHeader from "../../../components/homeScreen/homeHeader";
import PostList from "../../../components/homeScreen/postList";
import { useSelector } from "react-redux";

const Home = () => {
  const [postData, setPostData] = useState([]);
  const { user } = useSelector((state) => state.auth); 
  const [refreshing, setRefreshing] = useState(false); // For manual pull-to-refresh

  const fetchPost = useCallback(async () => {
    setRefreshing(true); // Show refreshing indicator
    try {
      const result = await getAllPost();
      if (result.success) {
        const fetchedPosts = result.data.posts || [];
        const randomizedPosts = fetchedPosts.sort(() => Math.random() - 0.5);
        setPostData([...randomizedPosts]);
      } else {
        showToast("error", result.message || "Something went wrong");
        // console.error(result.message);
      }
    } catch (error) {
      showToast("error", "Failed to fetch posts");
      // console.error("Error fetching posts:", error);
    } finally {
      setRefreshing(false); // Hide refreshing indicator
    }
  }, []);

  
  useEffect(() => {
    fetchPost();
  }, [user, fetchPost]); 

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-1">
        <HomeHeader  />
        <FlatList
          data={postData}
          keyExtractor={(item) => item.id || item._id}
          renderItem={({ item }) => <PostList item={item} action="post" />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
          refreshing={refreshing} // Pull-to-refresh indicator
          onRefresh={fetchPost} // Trigger fetchPost on pull-to-refresh
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
