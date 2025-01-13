import React from "react";
import { View, TextInput, Pressable ,Text} from "react-native";
import ButtonComp from "../../constant/ButtonComp";

const InputSection = ({ content, setContent, replyTo, postComment ,setReplyTo}) => {
  return (
    <View>
      {replyTo && (
        <View className="flex-row justify-between mb-2 bg-amber-200">
          <Text className="text-gray-700">Replying to {replyTo?.user?.username}</Text>
          <Pressable
            onPress={() => {
              setContent("");
              setReplyTo(null);
            }}
          >
            <Text className="text-red-500 text-lg mr-10">x</Text>
          </Pressable>
        </View>
      )}
      <View className="flex-row gap-1">
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Enter your comment here.."
          className="p-3 border w-full text-base font-semibold border-black rounded-xl"
        />
        <ButtonComp
          title="Post"
          onPress={postComment}
          style={{
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
          }}
        />
      </View>
    </View>
  );
};

export default InputSection;
