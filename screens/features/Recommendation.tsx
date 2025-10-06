// features/recommendations/RecommendationEngine.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

const useRecommendations = () => {
  const { location } = useLocation();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!location) return;

  //   const unsubscribe = firestore()
  //     .collection('users')
  //     .where('location', 'near', {
  //       center: new firestore.GeoPoint(location.latitude, location.longitude),
  //       radius: 50, // 50km radius
  //     })
  //     .where('gender', '==', user.preferences?.gender || 'any')
  //     .where('age', '>=', user.preferences?.ageRange?.min || 18)
  //     .where('age', '<=', user.preferences?.ageRange?.max || 99)
  //     .limit(20)
  //     .onSnapshot(snapshot => {
  //       const users = snapshot.docs
  //         .filter(doc => doc.id !== user.uid)
  //         .map(doc => ({ id: doc.id, ...doc.data() }));
  //       setRecommendations(users);
  //       setLoading(false);
  //     });

  //   return () => unsubscribe();
  // }, [location, user]);

  return { recommendations, loading };
};

export default useRecommendations;