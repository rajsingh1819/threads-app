import { View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostList from "../../../components/postList";
import HomeHeader from "../../../components/homeHeader";
import { useEffect, useState, useCallback } from "react";
import { getAllPost } from "../../../provider/userAllApi";
import { showToast } from "../../../constant/showToast";

const Home = () => {
  const [postData, setPostData] = useState([]); // Posts displayed on the screen
 
  // Fetch posts from the backend
  const fectchPost = async () => {
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


 
  // Fetch posts on initial render
  useEffect(() => {
    fectchPost();
  }, []);



  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-1">
        <HomeHeader  />
        <FlatList
          data={postData}
          keyExtractor={(item) => item.id || item._id}
          renderItem={({ item }) => <PostList item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }} 
        
          
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
