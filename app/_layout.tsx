import { Slot, usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Import SafeAreaProvider
import { auth } from '../data/config/firebase'; // Ensure this path is correct

function RootLayout() {
  // Hooks are called at the top level - This is correct
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  // First useEffect for auth state - This looks correct
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe; // Cleanup function
  }, []); // Empty dependency array is correct

  // Second useEffect for navigation logic - This looks correct in terms of hook rules
  useEffect(() => {
    if (isLoading) {
      return; // Early return, hooks are already called above
    }

    const isRootPath = pathname === '/' || pathname === '';
    const inAuthGroup = segments.length > 0 && segments[0] === '(auth)';

    console.log('Navigation check:', { user: !!user, inAuthGroup, isRootPath, pathname, segments });

    if (user) {
      if (inAuthGroup || isRootPath) { // Simplified condition for redirecting to home
        console.log('User authenticated, redirecting to /tabs/home.');
        router.replace('/(tabs)/home');
      }
      // No else needed here, if user is auth'd and not on auth/root, they stay where they are
    } else { // User is not authenticated
      if (!inAuthGroup) {
        console.log('User not authenticated, not on auth page. Redirecting to /(auth)/login.');
        router.replace('/(auth)/login');
      }
      // If user is not auth'd and on auth page, they stay where they are
    }
  }, [user, isLoading, segments, router, pathname]); // Dependencies look correct

  // Conditional rendering based on isLoading - This is correct
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render Slot wrapped in SafeAreaProvider
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
export default RootLayout;