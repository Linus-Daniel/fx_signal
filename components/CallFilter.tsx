import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Animated, 
  Easing,
  StyleSheet
} from 'react-native';
import { tw } from '../utils/tailwind';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FadeIn, FadeOut } from 'react-native-reanimated';

type FilterOption = 'all' | 'missed' | 'outgoing' | 'incoming' | 'video';

interface CallHistoryFilterProps {
  selectedFilters: FilterOption[];
  onFiltersChange: (filters: FilterOption[]) => void;
}

const CallHistoryFilter: React.FC<CallHistoryFilterProps> = ({ 
  selectedFilters, 
  onFiltersChange 
}) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];
  const heightAnim = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Animated.timing(heightAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const height = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160], // Adjust based on content height
  });

  const toggleFilter = (filter: FilterOption) => {
    if (selectedFilters.includes(filter)) {
      // For 'all' we need special handling
      if (filter === 'all') {
        onFiltersChange(['all']);
      } else {
        const newFilters = selectedFilters.filter(f => f !== filter);
        onFiltersChange(newFilters.length > 0 ? newFilters : ['all']);
      }
    } else {
      // When selecting any filter, remove 'all' if present
      const newFilters = [...selectedFilters.filter(f => f !== 'all'), filter];
      onFiltersChange(newFilters);
    }
  };

  const getActiveFilterLabel = () => {
    if (selectedFilters.length === 1 && selectedFilters[0] === 'all') {
      return 'All Calls';
    }
    return `${selectedFilters.length} Active Filters`;
  };

  return (
    <View style={tw`px-4 pt-3 pb-2 bg-white`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-gray-500 font-medium`}>Filter by</Text>
        
        <TouchableOpacity 
          onPress={toggleExpand}
          style={tw`flex-row items-center`}
          activeOpacity={0.7}
        >
          <Text style={tw`text-rose-500 font-medium mr-2`}>
            {getActiveFilterLabel()}
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={tw.color('rose-500')} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.filterContainer, { height }]}>
        <View style={tw`flex-row flex-wrap justify-between mt-3`}>
          <FilterButton
            label="All Calls"
            icon="call"
            active={selectedFilters.includes('all')}
            onPress={() => toggleFilter('all')}
          />
          
          <FilterButton
            label="Missed"
            icon="close-circle"
            active={selectedFilters.includes('missed')}
            onPress={() => toggleFilter('missed')}
            badgeColor="red"
          />
          
          <FilterButton
            label="Outgoing"
            icon="call-outline"
            active={selectedFilters.includes('outgoing')}
            onPress={() => toggleFilter('outgoing')}
          />
          
          <FilterButton
            label="Incoming"
            icon="call-incoming"
            active={selectedFilters.includes('incoming')}
            onPress={() => toggleFilter('incoming')}
          />
          
          <FilterButton
            label="Video"
            icon="videocam"
            active={selectedFilters.includes('video')}
            onPress={() => toggleFilter('video')}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const FilterButton = ({ 
  label, 
  icon, 
  active, 
  onPress, 
  badgeColor 
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
  badgeColor?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      tw`items-center justify-center p-2 mb-2 rounded-lg w-1/3`,
      active ? tw`bg-rose-50 border border-rose-100` : tw`bg-gray-50`
    ]}
  >
    <View style={tw`relative`}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={active ? tw.color('rose-500') : tw.color('gray-600')} 
      />
      {badgeColor && active && (
        <View style={[
          tw`absolute -top-1 -right-1 w-2 h-2 rounded-full`,
          { backgroundColor: badgeColor }
        ]} />
      )}
    </View>
    <Text style={[
      tw`mt-1 text-xs font-medium`,
      active ? tw`text-rose-500` : tw`text-gray-600`
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterContainer: {
    overflow: 'hidden',
  },
});

export default CallHistoryFilter;