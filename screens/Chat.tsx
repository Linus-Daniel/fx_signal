import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity 
} from 'react-native';
import { tw } from '../utils/tailwind';
import { useAuth } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { User } from '../types';
import { getMockMessages } from '../utils/performance';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
}

const ChatScreen = () => {
  const route = useRoute();
  const { match } = route.params as { match: User };
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  

  useEffect(() => {
    // Load mock messages when component mounts
    if (!user || !match) return;
    const mockMessages = getMockMessages(user.id, match.id);
    setMessages(mockMessages);
  }, [user.id, match.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      senderId: user.id,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        tw`p-3 rounded-lg max-w-3/4 mb-2 mx-4`,
        item.senderId === user.id
          ? tw`bg-rose-500 self-end rounded-tr-none`
          : tw`bg-gray-200 self-start rounded-tl-none`,
      ]}
    >
      <Text
        style={item.senderId === user.id ? tw`text-white` : tw`text-gray-800`}
      >
        {item.text}
      </Text>
      <Text
        style={[
          tw`text-xs mt-1`,
          item.senderId === user.id ? tw`text-rose-200` : tw`text-gray-500`,
        ]}
      >
        {item.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-gray-50`}
      keyboardVerticalOffset={80}
    >
      <View style={tw`p-4 border-b border-gray-200 flex-row items-center`}>
        <Image
          source={{ uri: match?.images?.[0] || 'https://randomuser.me/api/portraits/women/44.jpg' }}
          style={tw`w-10 h-10 rounded-full mr-3`}
        />
        <View>
          <Text style={tw`font-bold text-lg`}>{match?.name}</Text>
          <Text style={tw`text-gray-500 text-xs`}>Online</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pt-4`}
        renderItem={renderItem}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={tw`p-3 border-t border-gray-200 bg-white`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity style={tw`p-2`}>
            <Ionicons name="add" size={24} color={tw.color('rose-500')} />
          </TouchableOpacity>
          <TextInput
            style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mx-2`}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!message.trim()}
            style={[
              tw`rounded-full w-10 h-10 items-center justify-center`,
              !message.trim() ? tw`bg-gray-300` : tw`bg-rose-500`,
            ]}
          >
            <Ionicons
              name="send"
              size={20}
              color={!message.trim() ? tw.color('gray-500') : 'white'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;