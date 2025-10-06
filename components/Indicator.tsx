import React from 'react';
import { View } from 'react-native';
import { tw } from '../utils/tailwind';
import LottieView from 'lottie-react-native';

const TypingIndicator = () => {
  return (
    <View style={tw`bg-gray-200 p-3 rounded-full self-start rounded-tl-none`}>
      <LottieView
        source={require('../assets/animations/typing.json')}
        autoPlay
        loop
        style={tw`w-16 h-6`}
      />
    </View>
  );
};

export default TypingIndicator;