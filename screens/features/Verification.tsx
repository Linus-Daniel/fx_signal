// features/profile-verification/VerificationProcess.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { tw } from '../../utils/tailwind';
import {Ionicons} from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../context/AuthContext';

const VerificationProcess = () => {
  const { user } = useAuth();
  const [verificationPhoto, setVerificationPhoto] = useState(null);
  const [status, setStatus] = useState(user.verificationStatus || 'unverified');
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'front',
    });

    if (!result.didCancel && result.assets?.[0]?.uri) {
      setVerificationPhoto(result.assets[0]);
    }
  };

  const uploadForVerification = async () => {
    if (!verificationPhoto) return;
    setLoading(true);

    try {
      // Upload photo to storage
    //   const reference = storage().ref(`verifications/${user.uid}`);
    //   await reference.putFile(verificationPhoto.uri);

    //   // Update user document with verification request
    //   await firestore().collection('users').doc(user.uid).update({
    //     verificationStatus: 'pending',
    //     verificationPhoto: await reference.getDownloadURL(),
    //   });

      setStatus('pending');
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-2xl font-bold mb-6`}>Photo Verification</Text>

      {status === 'verified' ? (
        <View style={tw`items-center`}>
          <View style={tw`bg-green-100 p-4 rounded-full mb-4`}>
            <Ionicons name="checkmark-circle" size={48} color={tw.color('green-500')} />
          </View>
          <Text style={tw`text-lg font-medium`}>Your profile is verified</Text>
          <Text style={tw`text-gray-500 mt-2`}>
            This helps others know you're a real person
          </Text>
        </View>
      ) : status === 'pending' ? (
        <View style={tw`items-center`}>
          <View style={tw`bg-blue-100 p-4 rounded-full mb-4`}>
            <Ionicons name="time" size={48} color={tw.color('blue-500')} />
          </View>
          <Text style={tw`text-lg font-medium`}>Verification in progress</Text>
          <Text style={tw`text-gray-500 mt-2`}>
            We're reviewing your submission (usually takes 24-48 hours)
          </Text>
        </View>
      ) : (
        <>
          <Text style={tw`text-gray-700 mb-4`}>
            Take a selfie mimicking the pose below to verify your profile photo
          </Text>

          <View style={tw`flex-row justify-between mb-6`}>
            <View style={tw`items-center`}>
              <Image
                source={{ uri: user.images[0] }}
                style={tw`w-32 h-32 rounded-lg mb-2`}
              />
              <Text style={tw`text-sm`}>Your profile photo</Text>
            </View>

            <View style={tw`items-center`}>
              <View style={tw`w-32 h-32 bg-gray-100 rounded-lg mb-2 items-center justify-center`}>
                <Text style={tw`text-6xl`}>✌️</Text>
              </View>
              <Text style={tw`text-sm`}>Make this pose</Text>
            </View>
          </View>

          {verificationPhoto ? (
            <>
              <Image
                source={{ uri: verificationPhoto.uri }}
                style={tw`w-full h-64 rounded-lg mb-4`}
              />
              <TouchableOpacity
                onPress={uploadForVerification}
                disabled={loading}
                style={tw`bg-rose-500 py-3 rounded-full items-center`}
              >
                <Text style={tw`text-white font-medium`}>
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePhoto}
                style={tw`mt-3 py-3 border border-gray-300 rounded-full items-center`}
              >
                <Text style={tw`font-medium`}>Retake Photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={takePhoto}
              style={tw`bg-rose-500 py-3 rounded-full items-center`}
            >
              <Text style={tw`text-white font-medium`}>Take Verification Photo</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default VerificationProcess