import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import { tw } from '../../utils/tailwind';
import { User } from "../../types/index"; 

interface MatchModalProps {
  visible: boolean;
  matchedUser: User | null;
  onClose: () => void;
  onMessage: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ visible, matchedUser, onClose, onMessage }) => {
  if (!matchedUser) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/90 justify-center items-center p-6`}>
        <View style={tw`bg-white rounded-3xl p-6 w-full max-w-md`}>
          <Text style={tw`text-2xl font-bold text-center mb-2`}>It's a Match!</Text>
          <Text style={tw`text-center text-gray-600 mb-4`}>
            You and {matchedUser.name} have liked each other
          </Text>

          <View style={tw`flex-row justify-center my-6`}>
            <View style={tw`w-32 h-32 rounded-full border-4 border-rose-500`}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} // Current user photo
                style={tw`w-full h-full rounded-full`}
              />
            </View>
            <View style={tw`w-32 h-32 rounded-full border-4 border-rose-500 -ml-6`}>
              <Image
                source={{ uri: matchedUser.images[0] }}
                style={tw`w-full h-full rounded-full`}
              />
            </View>
          </View>

          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              onPress={onClose}
              style={tw`flex-1 py-3 bg-gray-100 rounded-full items-center`}
            >
              <Text style={tw`font-medium text-gray-900`}>Keep Swiping</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onMessage}
              style={tw`flex-1 py-3 bg-rose-500 rounded-full items-center`}
            >
              <Text style={tw`font-medium text-white`}>Say Hello</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MatchModal;