import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { tw } from '../utils/tailwind';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      title: 'Find Your Perfect Match',
      description: 'Connect with people who share your interests and values',
      image: require('../assets/images/img1.jpg'),
    },
    {
      title: 'Swipe Right to Like',
      description: 'Swipe right on profiles you like and left to pass',
      image: require('../assets/images/img2.png'),
    },
    {
      title: 'Chat with Your Matches',
      description: 'Start meaningful conversations with your matches',
      image: require('../assets/images/img3.png'),
    },
  ];

  const handleGetStarted = () => {
    navigation.navigate('Auth' as never); // Adjust navigation type as needed
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Swiper
        loop={false}
        onIndexChanged={setActiveIndex}
        dotColor={tw.color('gray-300')}
        activeDotColor={tw.color('rose-500')}
        paginationStyle={tw`bottom-8`}
      >
        {slides.map((slide, index) => (
          <View key={index} style={tw`flex-1 items-center justify-center p-6`}>
            <Image
              source={slide.image}
              style={tw`w-full h-96 mb-8`}
              resizeMode="contain"
            />
            <Text style={tw`text-3xl font-bold text-center text-gray-900 mb-4`}>
              {slide.title}
            </Text>
            <Text style={tw`text-lg text-center text-gray-600 mb-8`}>
              {slide.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <View style={tw`absolute bottom-16 left-0 right-0 px-6`}>
        {activeIndex === slides.length - 1 ? (
          <TouchableOpacity
            onPress={handleGetStarted}
            style={tw`bg-rose-500 py-4 rounded-full items-center`}
          >
            <Text style={tw`text-white font-bold text-lg`}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity onPress={handleGetStarted}>
              <Text style={tw`text-gray-500 font-medium`}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveIndex(activeIndex + 1)}
              style={tw`bg-rose-500 px-6 py-2 rounded-full`}
            >
              <Text style={tw`text-white font-medium`}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;