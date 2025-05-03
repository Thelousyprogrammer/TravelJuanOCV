import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 10000); // 3 seconds

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [navigation]);

  return (
<Image 
  source={require('../assets/images/TravelJuan.png')} 
  style={styles.logo}
/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
