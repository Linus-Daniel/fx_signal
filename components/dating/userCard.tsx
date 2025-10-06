import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { tw } from "../../utils/tailwind";
import { RootStackParamList, User } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface UserCardProps {
  user: User;
  onLike: () => void;
  onDislike: () => void;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onLike,
  onDislike,
  onPress,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={tw`flex-1 bg-white rounded-3xl overflow-hidden`}>
      {/* Main image */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ViewProfile", { user })}
        style={tw`flex-1`}
      >
        <Image
          source={{ uri: user.images[0] }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* User info overlay */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent`}
      >
        <Text style={tw`text-white text-2xl font-bold`}>
          {user.name}, {user.age}
        </Text>
        <Text style={tw`text-gray-200`}>{user.distance}</Text>
        <Text style={tw`text-white mt-2`} numberOfLines={2}>
          {user.bio}
        </Text>

        {/* Interests */}
        <View style={tw`flex-row flex-wrap mt-2`}>
          {user.interests.map((interest, index) => (
            <View
              key={index}
              style={tw`bg-white bg-opacity-20 rounded-full px-3 py-1 mr-2 mb-2`}
            >
              <Text style={tw`text-white text-xs`}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action buttons */}
      <View style={tw`absolute bottom-4 right-4 flex-row`}>
        <TouchableOpacity
          onPress={onDislike}
          style={tw`bg-white rounded-full w-12 h-12 items-center justify-center mr-2`}
        >
          <Text style={tw`text-red-500 text-2xl`}>✖</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLike}
          style={tw`bg-white rounded-full w-12 h-12 items-center justify-center`}
        >
          <Text style={tw`text-green-500 text-2xl`}>❤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserCard;
