import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { tw } from '../utils/tailwind';


const CallQualityIndicator: React.FC<{ style?: any }> = ({ style }) => {
  // In a real app, you would get this from the call stats
  const [quality,setQuality] = useState<'good' | 'poor' | 'good' | 'excellent'>("good")
  
  return (
    <View style={[tw`flex-row items-center`, style]}>
      <View style={tw`flex-row mr-2`}>
        {[1, 2, 3].map((i) => (
          <View 
            key={i}
            style={[
              tw`w-1 h-${i} mx-0.5 rounded-full`,
              quality === 'poor' && i > 1 ? tw`bg-gray-400` : 
              quality === 'good' && i > 2 ? tw`bg-gray-400` : 
              tw`bg-green-500`
            ]}
          />
        ))}
      </View>
      <Text style={tw`text-xs text-white`}>
        {quality === 'poor' ? 'Poor connection' : 
         quality === 'good' ? 'Good connection' : 'Excellent connection'}
      </Text>
    </View>
  );
};

export default CallQualityIndicator;