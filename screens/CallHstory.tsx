// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
// import { tw } from '../utils/tailwind';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types/index';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { User } from '../types';

// interface CallHistoryItem {
//   id: string;
//   user: User;
//   type: 'audio' | 'video';
//   date: Date;
//   duration: number;
//   direction: 'outgoing' | 'incoming';
//   status: 'answered' | 'missed' | 'rejected';
// }

// const CallHistory = () => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   // Mock call history data
//   const callHistory: CallHistoryItem[] = [
//     {
//       id: '1',
//       user: {
//         id: 'user1',
//         name: 'Alex Johnson',
//         images: ['https://randomuser.me/api/portraits/women/44.jpg'],
//         bio: 'Digital designer',
//         interests: ['Photography', 'Travel'],
//         distance: '3 miles away',
//         age: 28,
//         isVerified:true,
//         location:"Canada"
//       },
//       type: 'video',
//       date: new Date(Date.now() - 3600000), // 1 hour ago
//       duration: 325,
//       direction: 'outgoing',
//       status: 'answered'
//     },
//     {
//       id: '2',
//       user: {
//         location:"Nigeria",
//         id: 'user2',
//         name: 'Jamie Smith',
//         images: ['https://randomuser.me/api/portraits/men/32.jpg'],
//         bio: 'Software engineer',
//         interests: ['Technology', 'Dogs'],
//         distance: '7 miles away',
//         age: 31,
//         isVerified:true
//       },
//       type: 'audio',
//       date: new Date(Date.now() - 86400000), // 1 day ago
//       duration: 0,
//       direction: 'incoming',
//       status: 'missed'
//     },
//   ];

//   const formatTime = (seconds: number) => {
//     if (seconds === 0) return '';
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const formatDate = (date: Date) => {
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
    
//     if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//     if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
//     return date.toLocaleDateString();
//   };

//   const startCall = (user: User, isVideoCall: boolean) => {
//     navigation.navigate('Call', { user, isVideoCall });
//   };

//   const renderItem = ({ item }: { item: CallHistoryItem }) => (
//     <TouchableOpacity 
//       style={tw`flex-row items-center p-4 border-b border-gray-100`}
//       onPress={() =>{ const user = item.user; 

//         navigation.navigate('ViewProfile', {user })
//         console.log(user)
      
//       }}
//     >
//       <Image
//         source={{ uri: item.user.images[0] }}
//         style={tw`w-12 h-12 rounded-full mr-4`}
//       />
//       <View style={tw`flex-1`}>
//         <View style={tw`flex-row justify-between items-center mb-1`}>
//           <Text style={tw`font-bold`}>{item.user.name}</Text>
//           <Text style={tw`text-gray-500 text-xs`}>
//             {formatDate(item.date)}
//           </Text>
//         </View>
//         <View style={tw`flex-row items-center`}>
//           <Ionicons 
//             name={item.type === 'video' ? 'videocam' : 'call'} 
//             size={16} 
//             color={tw.color('gray-500')} 
//             style={tw`mr-2`}
//           />
//           <Text style={tw`text-gray-500 text-sm mr-3`}>
//             {item.direction === 'outgoing' ? 'Outgoing' : 'Incoming'}
//             {item.status === 'missed' ? ' • Missed' : ''}
//           </Text>
//           {item.duration > 0 && (
//             <Text style={tw`text-gray-500 text-sm`}>
//               {formatTime(item.duration)}
//             </Text>
//           )}
//         </View>
//       </View>
//       <View style={tw`flex-row`}>
//         <TouchableOpacity 
//           style={tw`p-2 mr-2`}
//           onPress={() => startCall(item.user, item.type === 'video')}
//         >
//           <Ionicons 
//             name={item.type === 'video' ? 'videocam' : 'call'} 
//             size={24} 
//             color={tw.color('rose-500')} 
//           />
//         </TouchableOpacity>
//         <TouchableOpacity 
//         onPress={()=>navigation.navigate("Chat",{match:item.user})}
//         style={tw`p-2`}>
//           <Ionicons 
//             name="chatbubble-ellipses" 
//             size={24} 
//             color={tw.color('gray-400')} 
//           />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={tw`flex-1 bg-white`}>
//       <View style={tw`p-4 border-b border-gray-100`}>
//         <Text style={tw`text-2xl font-bold`}>Call History</Text>
//       </View>

//       <FlatList
//         data={callHistory}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={tw`pb-4`}
//         ListEmptyComponent={
//           <View style={tw`flex-1 items-center justify-center p-6`}>
//             <Ionicons 
//               name="call" 
//               size={48} 
//               color={tw.color('gray-300')} 
//               style={tw`mb-4`}
//             />
//             <Text style={tw`text-xl font-bold text-gray-900 mb-2`}>
//               No call history
//             </Text>
//             <Text style={tw`text-gray-600 text-center`}>
//               Your calls will appear here
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// export default CallHistory;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SectionList } from 'react-native';
import { tw } from '../utils/tailwind';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { User } from '../types';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import CallHistoryFilter from '../components/CallFilter';

interface CallHistoryItem {
  id: string;
  user: User;
  type: 'audio' | 'video';
  timestamp: string;
  duration: number;
  direction: 'outgoing' | 'incoming';
  status: 'answered' | 'missed' | 'rejected';
}

const CallHistory = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch call history from API
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  
  useEffect(() => {
    const fetchCallHistory = async () => {
      try {
        // Simulate API call
        const data = await mockFetchCallHistory();
        setCallHistory(data);
      } catch (error) {
        console.error('Failed to fetch call history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallHistory();
  }, []);

  // Group calls by date
  const groupedCalls = callHistory.reduce((acc, call) => {
    const date = new Date(call.timestamp);
    let dateLabel;
    
    if (isToday(date)) {
      dateLabel = 'Today';
    } else if (isYesterday(date)) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = format(date, 'MMMM d, yyyy');
    }

    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    
    if (filter === 'all' || (filter === 'missed' && call.status === 'missed')) {
      acc[dateLabel].push(call);
    }
    
    return acc;
  }, {} as Record<string, CallHistoryItem[]>);

  const sections = Object.entries(groupedCalls)
    .map(([title, data]) => ({ title, data }))
    .filter(section => section.data.length > 0);

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCallPress = (user: User, isVideo: boolean) => {
    navigation.navigate('Call', { user, isVideoCall: isVideo });
  };

  const renderItem = ({ item }: { item: CallHistoryItem }) => (
    <TouchableOpacity 
      style={tw`flex-row items-center p-4`}
      onPress={() =>{ navigation.navigate('ViewProfile', { user: item.user })}}
    >
      <View style={tw`relative`}>
        <Image
          source={{ uri: item.user.images[0] }}
          style={tw`w-12 h-12 rounded-full mr-4`}
        />
        {item.status === 'missed' && (
          <View style={tw`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white`} />
        )}
      </View>
      
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-center mb-1`}>
          <Text style={tw`font-bold ${item.status === 'missed' ? 'text-red-500' : 'text-gray-900'}`}>
            {item.user.name}
          </Text>
          <Text style={tw`text-gray-500 text-xs`}>
            {format(parseISO(item.timestamp), 'h:mm a')}
          </Text>
        </View>
        
        <View style={tw`flex-row items-center`}>
          <Ionicons 
            name={item.type === 'video' ? 'videocam' : 'call'} 
            size={14} 
            color={tw.color('gray-500')} 
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-500 text-sm`}>
            {item.direction === 'outgoing' ? 'Outgoing' : 'Incoming'}
            {item.duration > 0 && ` • ${formatDuration(item.duration)}`}
          </Text>
        </View>
      </View>
      
      <View style={tw`flex-row`}>
        <TouchableOpacity 
          style={tw`p-2 mr-2`}
          onPress={() => handleCallPress(item.user, item.type === 'video')}
        >
          <Ionicons 
            name={item.type === 'video' ? 'videocam' : 'call'} 
            size={24} 
            color={tw.color('rose-500')} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`p-2`}
          onPress={() => navigation.navigate('Chat', { match: item.user })}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={24} 
            color={tw.color('gray-400')} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 border-b border-gray-100`}>
        <Text style={tw`text-2xl font-bold`}>Call History</Text>
      </View>

      <CallHistoryFilter 
        selectedFilters={[filter]}
        onFiltersChange={setFilter}
      />

      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <Ionicons name="refresh" size={24} color={tw.color('gray-400')} style={tw`animate-spin`} />
        </View>
      ) : sections.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center p-6`}>
          <Ionicons 
            name="call" 
            size={48} 
            color={tw.color('gray-300')} 
            style={tw`mb-4`}
          />
          <Text style={tw`text-xl font-bold text-gray-900 mb-2`}>
            {filter === 'missed' ? 'No missed calls' : 'No call history'}
          </Text>
          <Text style={tw`text-gray-600 text-center`}>
            {filter === 'missed' 
              ? 'Your missed calls will appear here' 
              : 'Your call history will appear here'}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={tw`bg-gray-50 px-4 py-2`}>
              <Text style={tw`font-medium text-gray-500`}>{title}</Text>
            </View>
          )}
          contentContainerStyle={tw`pb-4`}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
};

// Mock API call
const mockFetchCallHistory = async (): Promise<CallHistoryItem[]> => {
  return [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Alex Johnson',
        images: ['https://randomuser.me/api/portraits/women/44.jpg'],
        bio: 'Digital designer',
        interests: ['Photography', 'Travel'],
        distance: '3 miles away',
        age: 28
      },
      type: 'video',
      timestamp: new Date().toISOString(),
      duration: 325,
      direction: 'outgoing',
      status: 'answered'
    },
    // More mock items...
  ];
};

export default CallHistory;