// features/payments/PremiumScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tw } from '../../utils/tailwind';
import Purchases from 'react-native-purchases';
import { useAuth } from '../../context/AuthContext';
import Ionicons from "react-native-vector-icons/Ionicons"

const PremiumScreen = () => {
  const { user, updateUser } = useAuth();
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setOfferings(offerings.current);
        }
      } catch (error) {
        console.error('Error fetching offerings:', error);
      }
    };

    fetchOfferings();
  }, []);

  const purchasePackage = async (pkg) => {
    setLoading(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (customerInfo.entitlements.active.premium) {
        updateUser({ isPremium: true });
      }
    } catch (error) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    setLoading(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active.premium) {
        updateUser({ isPremium: true });
      }
    } catch (error) {
      console.error('Restore error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-6`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Go Premium</Text>
      <Text style={tw`text-gray-600 mb-6`}>Unlock all features and get more matches</Text>

      {user.isPremium ? (
        <View style={tw`bg-green-50 p-4 rounded-lg mb-6`}>
          <Text style={tw`text-green-700 font-medium`}>
            You're a premium member! Enjoy all features.
          </Text>
        </View>
      ) : (
        <>
          <View style={tw`mb-8`}>
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`w-6 h-6 bg-rose-100 rounded-full items-center justify-center mr-2`}>
                <Ionicons name="checkmark" size={16} color={tw.color('rose-500')} />
              </View>
              <Text style={tw`text-gray-800`}>Unlimited likes</Text>
            </View>
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`w-6 h-6 bg-rose-100 rounded-full items-center justify-center mr-2`}>
                <Ionicons name="checkmark" size={16} color={tw.color('rose-500')} />
              </View>
              <Text style={tw`text-gray-800`}>See who liked you</Text>
            </View>
            <View style={tw`flex-row items-center mb-3`}>
              <View style={tw`w-6 h-6 bg-rose-100 rounded-full items-center justify-center mr-2`}>
                <Ionicons name="checkmark" size={16} color={tw.color('rose-500')} />
              </View>
              <Text style={tw`text-gray-800`}>Advanced filters</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-6 h-6 bg-rose-100 rounded-full items-center justify-center mr-2`}>
                <Ionicons name="checkmark" size={16} color={tw.color('rose-500')} />
              </View>
              <Text style={tw`text-gray-800`}>Boost your profile weekly</Text>
            </View>
          </View>

          {offerings?.availablePackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.identifier}
              onPress={() => purchasePackage(pkg)}
              disabled={loading}
              style={tw`border border-rose-500 rounded-xl p-4 mb-3`}
            >
              <View style={tw`flex-row justify-between items-center mb-1`}>
                <Text style={tw`font-bold text-lg`}>{pkg.product.title}</Text>
                <Text style={tw`font-bold text-lg`}>{pkg.product.priceString}</Text>
              </View>
              <Text style={tw`text-gray-600`}>
                {pkg.packageType === 'ANNUAL' ? 'Yearly (Save 30%)' : 'Monthly'}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={restorePurchases}
            disabled={loading}
            style={tw`mt-4`}
          >
            <Text style={tw`text-rose-500 text-center`}>Restore Purchases</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PremiumScreen