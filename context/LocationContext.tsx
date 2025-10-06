// features/location/LocationContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationContextType {
  location: { latitude: number; longitude: number } | null;
  error: string | null;
  requestPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType>(null!);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return false;
      }
      return true;
    } catch (err) {
      setError('Permission request error');
      return false;
    }
  };

  const getLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    }
  };

  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        await getLocation();
      }
    };

    init();
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
