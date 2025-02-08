import React,{useState} from "react";
import { View, Text, FlatList } from "react-native";
import PostSingleList from "../postSingleScreen/SingleList";
import Comment from "../postSingleScreen/Comment";

const Replies = ({ posts}) => {
   const [showReplies, setShowReplies] = useState(false);
  if (!posts || posts.length === 0) {
    return (
      <View style={{ padding: 10 }}>
        <Text>No Replies available.</Text>
      </View>
    );
  }
  const handleReply =()=>{
    setShowReplies(!showReplies)

  }



  return (
  <View className="flex-1 mt-5">
      <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View>
          <PostSingleList item={item} action="post"   onMessageIconPress={handleReply}/>

          {/* Loop through comments */}

          { showReplies &&
          
          item?.comments?.length > 0 && (
            item?.comments?.map((comment) => (
              <View key={comment._id} className="ml-10 mt-2">
                <Comment comment={comment} action="post"  />
              </View>
            ))
          )
          
          }
        </View>
      )}
    />


  </View> 
   );
};

export default Replies;




 {/* {comment?.replies?.length > 0 && (
                        <View>
                          {comment.replies.map((reply) => (
                            <UserReply key={reply._id} reply={reply} />
                          ))}
                        </View>
                      ) } */}