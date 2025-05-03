import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to navigate here - the Root Layout will handle redirection
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo/Image Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/TravelJuan.png')} 
          style={styles.logo}
        />
      </View>
      
      <Text style={styles.title}>Hello!</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Pressable 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Text>
      </Pressable>
      
      <View style={styles.linkContainer}>
        <Text>Don't have an account? </Text>
        <Link href="/register">
          <Text style={styles.link}>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});