import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import ButtonComp from "../../constant/ButtonComp";
import imagePath from "../../constant/imagePath";
import { Link } from "expo-router";
import { showToast } from "../../constant/showToast";
import { handleAccept, handleReject, UnfollowUser } from "../../provider/userAllApi";

const RequestScreen = ({ item, currentUser, fetchUser }) => { // Add fetchUser to props
  const [status, setStatus] = useState(null);

  const handleAcceptRequest = async () => {
    try {
      const response = await handleAccept(currentUser?._id, item._id);
      if (response) {
        setStatus("Accepted");
        showToast("success", "Follow request accepted");
        fetchUser(); // Fetch updated user data
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      const response = await handleReject(currentUser?._id, item._id);
      if (response) {
        setStatus("Rejected");
        showToast("info", "Follow request rejected");
        fetchUser(); // Fetch updated user data
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await UnfollowUser(currentUser?._id, item._id);
      if (response) {
        setStatus("Canceled");
        showToast("info", "Request canceled");
        fetchUser(); // Fetch updated user data
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <View className="bg-gray-200 p-3 mb-2 rounded-lg flex-row items-center">
      <Link href={`/user/${item._id}`} asChild>
        <View className="flex-1 flex-row gap-1 items-center">
          <Image
            source={{ uri: item?.avatar?.cloudinary || imagePath?.user }}
            className="h-14 w-14 bg-gray-300 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-black text-lg font-medium">{item.username}</Text>
        </View>
      </Link>

      {status ? (
        <Text className="text-green-600 font-medium">{status}</Text>
      ) : (
        <View className="flex-row gap-2 w-50">
          {item.receivedFollowRequests?.includes(currentUser?._id) ? (
            <ButtonComp
              title="Request Sent"
              onPress={handleUnfollow}
              style={{ backgroundColor: "green", height: 50 }}
            />
          ) : (
            <>
              <ButtonComp
                title="Accept"
                onPress={handleAcceptRequest}
                style={{ backgroundColor: "green", height: 50, width: 100 }}
              />
              <ButtonComp
                title="Reject"
                onPress={handleRejectRequest}
                style={{ backgroundColor: "red", height: 50, width: 100 }}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default RequestScreen;
