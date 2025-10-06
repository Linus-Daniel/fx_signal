import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';



interface AuthContextType {
  user: Partial<User> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (userData: { email: string; name: string; password: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>(null!);



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Partial<User> | null>({
    id: '1',
    email: 'ld604068@gmail.com',
    name: 'John Doe',
    token: 'mockToken1',
    age:28,
    isVerified:false,
    password: '12345',
    images: [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    ],

      bio: "Digital designer and coffee enthusiast. Love hiking and exploring new places.",
      location: "San Francisco, CA",
      job: "Senior UI Designer at TechCo",

      interests: ["Photography", "Travel", "Coffee", "Hiking", "Art"],

  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await AsyncStorage.clear()
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userExists = user;
      
      if (!userExists || userExists.password !== password) {
        return { success: false, message: 'Invalid email or password' };
      }
      
      const { password: _, ...userData } = userExists; // Remove password before storing
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      console.log("Loggin out please wait")
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; name: string; password: string }) => {
    try {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user.email) {
        return { success: false, message: 'Email already exists' };
      }
      
      const newUser:Partial<User>= {
        id: `mockId-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        token: `mockToken-${Date.now()}`,
      };
      
      // Add to mock database (with password for login veri
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed', error);
      return { success: false, message: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);