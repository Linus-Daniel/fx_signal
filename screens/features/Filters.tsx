// features/recommendations/Filters.tsx
import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { tw} from "../../utils/tailwind"
import Slider from '@react-native-community/slider';
import { useAuth } from '../../context/AuthContext';

const Filters = () => {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState(user.preferences || {
    gender: 'any',
    ageRange: { min: 18, max: 50 },
    distance: 50,
    showVerifiedOnly: false,
  });

  const savePreferences = () => {
    updateUser({ preferences });
  };

  return (
    <ScrollView style={tw`flex-1 bg-white p-6`}>
      <Text style={tw`text-2xl font-bold mb-6`}>Discovery Preferences</Text>

      <View style={tw`mb-8`}>
        <Text style={tw`text-lg font-medium mb-3`}>Show me</Text>
        <View style={tw`flex-row justify-between mb-4`}>
          <TouchableOpacity
            onPress={() => setPreferences({ ...preferences, gender: 'women' })}
            style={[
              tw`px-4 py-2 rounded-full border`,
              preferences.gender === 'women' ? tw`bg-rose-500 border-rose-500` : tw`border-gray-300`,
            ]}
          >
            <Text style={preferences.gender === 'women' ? tw`text-white` : tw`text-gray-800`}>
              Women
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPreferences({ ...preferences, gender: 'men' })}
            style={[
              tw`px-4 py-2 rounded-full border`,
              preferences.gender === 'men' ? tw`bg-rose-500 border-rose-500` : tw`border-gray-300`,
            ]}
          >
            <Text style={preferences.gender === 'men' ? tw`text-white` : tw`text-gray-800`}>
              Men
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPreferences({ ...preferences, gender: 'any' })}
            style={[
              tw`px-4 py-2 rounded-full border`,
              preferences.gender === 'any' ? tw`bg-rose-500 border-rose-500` : tw`border-gray-300`,
            ]}
          >
            <Text style={preferences.gender === 'any' ? tw`text-white` : tw`text-gray-800`}>
              Everyone
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`mb-8`}>
        <Text style={tw`text-lg font-medium mb-3`}>
          Age range: {preferences.ageRange.min} - {preferences.ageRange.max}
        </Text>
        <View style={tw`flex-row justify-between mb-1`}>
          <Text>18</Text>
          <Text>50+</Text>
        </View>
        <Slider
          minimumValue={18}
          maximumValue={50}
          step={1}
          minimumTrackTintColor={tw.color('rose-500')}
          maximumTrackTintColor={tw.color('gray-300')}
          thumbTintColor={tw.color('rose-500')}
          value={preferences.ageRange.min}
          onValueChange={value =>
            setPreferences({
              ...preferences,
              ageRange: { ...preferences.ageRange, min: value },
            })
          }
        />
        <Slider
          minimumValue={18}
          maximumValue={50}
          step={1}
          minimumTrackTintColor={tw.color('rose-500')}
          maximumTrackTintColor={tw.color('gray-300')}
          thumbTintColor={tw.color('rose-500')}
          value={preferences.ageRange.max}
          onValueChange={value =>
            setPreferences({
              ...preferences,
              ageRange: { ...preferences.ageRange, max: value },
            })
          }
        />
      </View>

      <View style={tw`mb-8`}>
        <Text style={tw`text-lg font-medium mb-3`}>
          Maximum distance: {preferences.distance} km
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={100}
          step={1}
          minimumTrackTintColor={tw.color('rose-500')}
          maximumTrackTintColor={tw.color('gray-300')}
          thumbTintColor={tw.color('rose-500')}
          value={preferences.distance}
          onValueChange={value => setPreferences({ ...preferences, distance: value })}
        />
      </View>

      <View style={tw`flex-row justify-between items-center mb-8`}>
        <Text style={tw`text-lg font-medium`}>Show verified profiles only</Text>
        <Switch
          value={preferences.showVerifiedOnly}
          onValueChange={value =>
            setPreferences({ ...preferences, showVerifiedOnly: value })
          }
          trackColor={{ false: tw.color('gray-300'), true: tw.color('rose-500') }}
          thumbColor={tw.color('white')}
        />
      </View>

      <TouchableOpacity
        onPress={savePreferences}
        style={tw`bg-rose-500 py-3 rounded-full items-center`}
      >
        <Text style={tw`text-white font-medium`}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};