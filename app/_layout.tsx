import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase'; // Your Firebase config file

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Clean up the listener on unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Check if the user is trying to access protected routes
    const inAuthGroup = segments[0] === '(auth)';
    const inHomeGroup = segments[0] === '(home)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if authenticated but in auth group
      router.replace('/(home)');
    }
  }, [user, segments, isLoading]);

  // Show a loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // The Slot component allows the child route to be displayed
  return <Slot />;
}