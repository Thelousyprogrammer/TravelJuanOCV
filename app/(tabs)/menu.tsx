import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { NavigationProp } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setBalance(userDoc.data().balance);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user ? user.displayName || user.email : 'Guest'}</Text>
      <Text style={styles.balance}>Balance: PHP {balance}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Ride')}>
        <Text style={styles.buttonText}>Start a Journey</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tickets')}>
        <Text style={styles.buttonText}>View Tickets</Text>
      </TouchableOpacity>
    </View>
  );
};

const RideScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Where are we off to?</Text>
      <Text style={styles.subHeader}>Plan your ride efficiently.</Text>
    </View>
  );
};

const TicketsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tickets</Text>
      <Text style={styles.subHeader}>Manage your active tickets and balance.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  balance: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export { HomeScreen, RideScreen, TicketsScreen };
