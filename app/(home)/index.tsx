import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import haversine from 'haversine';

export default function HomeScreen() {
  const [userName, setUserName] = useState('Traveller');
  const [nearestStation, setNearestStation] = useState('Loading...');
  const [crowdStatus, setCrowdStatus] = useState('Light');
  const [trainStatus, setTrainStatus] = useState('Train Departing');
  const [stationImage, setStationImage] = useState(require('../../assets/images/station-image.jpg'));

  // Enhanced stations array with image paths
  const stations = [
    { 
      name: 'Antipolo Station', 
      latitude: 14.624722, 
      longitude: 121.121111, 
      line: 'LRT2',
      image: require('../../assets/images/LRT2/Antipolo.jpg') 
    },
    { 
      name: 'Marikina-Pasig Station', 
      latitude: 14.620278, 
      longitude: 121.100278, 
      line: 'LRT2',
      image: require('../../assets/images/LRT2/Marikina_Pasig.jpg') 
    },
    { 
      name: 'Santolan Station', 
      latitude: 14.622139, 
      longitude: 121.085917, 
      line: 'LRT2',
      image: require('../../assets/images/LRT2/Santolan_LRT.jpg') 
    },
    { 
      name: 'Katipunan Station', 
      latitude: 14.631097, 
      longitude: 121.072958, 
      line: 'LRT2',
      image: require('../../assets/images/LRT2/Katipunan.jpg') 
    },
    { 
      name: 'Anonas Station', 
      latitude: 14.628, 
      longitude: 121.064694, 
      line: 'LRT2',
      image: require('../../assets/images/LRT2/Anonas.jpg') 
    },
    { 
      name: 'Araneta Center-Cubao Station', 
      latitude: 14.622678, 
      longitude: 121.052636, 
      line: 'LRT2',
      image: require('../../assets/images/LRT2/Cubao_LRT.jpg')
    },
  ];

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName);
    }
  
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setNearestStation('Permission Denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
  
      console.log('User Location:', userCoords);

      const nearest = stations.reduce((prev, curr) => {
        const prevDistance = haversine(userCoords, {
          latitude: prev.latitude,
          longitude: prev.longitude,
        }, { unit: 'km' });
  
        const currDistance = haversine(userCoords, {
          latitude: curr.latitude,
          longitude: curr.longitude,
        }, { unit: 'km' });

        console.log(`Distance to ${curr.name}:`, currDistance);
  
        return currDistance < prevDistance ? curr : prev;
      });
  
      setNearestStation(`${nearest.name} (${nearest.line})`);
      setStationImage(nearest.image);
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.bell}>🔔</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Card Balance</Text>
        <Text style={styles.balanceAmount}>₱409.00</Text>
      </View>

      {/* Buttons */}
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start a Journey</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>+ Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Change Card</Text>
        </TouchableOpacity>
      </View>

      {/* Station Details */}
      <Text style={styles.sectionTitle}>Nearest Station Info</Text>
      <Text style={styles.stationInfo}>{nearestStation}</Text>
      {/* Using the dynamically set stationImage */}
      <Image source={stationImage} style={styles.stationImage} />
      <Text style={styles.statusText}>Crowd Density: <Text style={styles.lightText}>{crowdStatus}</Text></Text>
      <Text style={styles.statusText}>Status: <Text style={styles.departingText}>{trainStatus}</Text></Text>

      {/* Offers */}
      <Text style={styles.offerTitle}>Juan-time Offers</Text>
      <Text style={styles.offerSubtitle}>Don't miss the Chance!</Text>
      <View style={styles.offerContainer}>
        <View style={styles.offerBox}>
          <Text style={styles.offerMain}>20% OFF</Text>
          <Text style={styles.offerDetails}>SJT tickets</Text>
          <Text style={styles.offerDate}>Until Oct 17, 2024</Text>
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
    backgroundColor: '#1C2526',
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginLeft: 5,
  },
  bell: {
    marginLeft: 'auto',
    fontSize: 18,
    color: '#FFFFFF',
  },
  balanceCard: {
    backgroundColor: '#3A4B5C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#00FF00',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stationInfo: {
    fontSize: 14,
    color: '#D3D3D3',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    margin: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FF8C00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    margin: 4,
  },
  secondaryButtonText: {
    color: '#1C2526',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF00FF',
    marginBottom: 10,
  },
  stationImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  lightText: {
    color: '#00FF00',
  },
  departingText: {
    color: '#FFD700',
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF00FF',
    marginTop: 20,
  },
  offerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  offerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerBox: {
    width: '48%',
    backgroundColor: '#3A4B5C',
    padding: 10,
    borderRadius: 10,
  },
  offerMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  offerDetails: {
    fontSize: 14,
    color: '#D3D3D3',
  },
  offerDate: {
    fontSize: 12,
    color: '#AAAAAA',
  },
});