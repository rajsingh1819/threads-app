import { View, Text, TouchableOpacity } from "react-native";
import React,{useState} from "react";
import UsersList from "./UsersList";
import RequestScreen from "./RequestScreen";
import Notification from "./Notification";

const ActiveMain = ({users}) => {
     const [activeScreen, setActiveScreen] = useState("Users");

     const switchScreen = (screen) => setActiveScreen(screen);

     const RenderScreen  =()=>{
      switch (activeScreen){
        case  "Users":
            return  <UsersList items={users}/>
        case  "Request":
            return <RequestScreen items={users}/>
        case 'Notify':
            return <Notification items={users}/>
            
      }
             
     }
    
  return (
    <View className=" flex-1  justify-between p-2 mt-3 gap-3 ">
    <Text className="font-bold text-3xl">Active Screen</Text>
    <View className="flex-row gap-1 ">
    {
        ["Users","Request","Notify"].map((screen,index)=>(
            <TouchableOpacity onPress={()=>switchScreen(screen)} activeOpacity={0.7} className="bg-black flex-1 p-3 rounded-lg  items-center">
                   <Text className="text-white">{screen}</Text>
            </TouchableOpacity>
            
        ))
     }
    </View>
     <RenderScreen/>
    </View>
  );
};

export default ActiveMain;
