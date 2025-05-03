import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const [userName, setUserName] = useState('Traveller');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.displayName) {
      setUserName(user.displayName);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>{userName}</Text>
        <FontAwesome name="bell-o" size={24} color="black" style={styles.bell} />
      </View>

      {/* Banner Image */}
      <Image source={require('../../assets/images/train-icon.png')} style={styles.trainImage} resizeMode="contain" />

      {/* Start & Top Up */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Start a Journey</Text>
      </TouchableOpacity>

      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>+ Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Change Card</Text>
        </TouchableOpacity>
      </View>

      {/* Station Info */}
      <Text style={styles.stationTitle}>Anonas Station</Text>
      <Text style={styles.stationSubtitle}>Nearest Train Station</Text>
      <Image source={require('../../assets/images/station-image.jpg')} style={styles.stationImage} />
      <Text style={styles.statusText}>Crowd Density: <Text style={styles.lightText}>Light</Text></Text>
      <Text style={styles.statusText}>Status: <Text style={styles.departingText}>Train Departing</Text></Text>

      {/* Offers */}
      <Text style={styles.offerTitle}>Juan-time Offers</Text>
      <Text style={styles.offerSubtitle}>Don’t miss the Chance!</Text>
      <View style={styles.offerContainer}>
        <View style={styles.offerBox}>
          <Text style={styles.offerMain}>20% OFF</Text>
          <Text style={styles.offerDetails}>SJT tickets</Text>
          <Text style={styles.offerDate}>Valid until October 17, 2024</Text>
        </View>
        <View style={styles.offerBox}>
          <Text style={styles.offerMain}>10% OFF</Text>
          <Text style={styles.offerDetails}>SVC and SJT</Text>
          <Text style={styles.offerDate}>First-time Purchase</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E8F0F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E94B3C',
    marginLeft: 5,
  },
  bell: {
    marginLeft: 'auto',
  },
  trainImage: {
    width: '100%',
    height: 120,
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderColor: '#2C2C2C',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  secondaryButtonText: {
    color: '#2C2C2C',
    fontWeight: 'bold',
  },
  rowButtons: {
    flexDirection: 'row',
  },
  stationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
  },
  stationSubtitle: {
    fontSize: 14,
    color: '#333',
  },
  stationImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  statusText: {
    marginTop: 5,
    fontSize: 14,
  },
  lightText: {
    color: 'green',
    fontWeight: 'bold',
  },
  departingText: {
    color: 'goldenrod',
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  offerSubtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  offerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerBox: {
    backgroundColor: '#E6E6E6',
    padding: 12,
    borderRadius: 8,
    width: '48%',
  },
  offerMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E94B3C',
  },
  offerDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  offerDate: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});
