import { stations as allLinesStations, StationList, StationMap } from '@/data/lib/stationData';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import haversine from 'haversine-distance';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import SafeAreaInsets hook
import { auth } from '../../data/config/firebase'; // Adjust path as needed
import AlertModal from '../components/AlertModal'; // Import your AlertModal - ADJUST PATH

const HomeScreen = () => {
  const [userName, setUserName] = useState('User');
  const [nearestStation, setNearestStation] = useState<StationList | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertModalContent, setAlertModalContent] = useState({
    title: "",
    message: "",
    buttonText: "OK",
    onButtonPress: undefined as (() => void) | undefined,
  });

  const router = useRouter();

  // Safe area insets hook to get padding for top, bottom, left, right
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || 'User');
    }
  }, []);

  const handleNotificationPress = () => {
    setAlertModalContent({
      title: "Notifications",
      message: "You have no new notifications. Would you like to view all system alerts?",
      buttonText: "View All Alerts",
      onButtonPress: () => {
        router.push('/alerts');
      }
    });
    setIsAlertVisible(true);
  };

  const getNearestStationFromLocalData = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Denied",
          "Location permission is needed to find the nearest station. Please enable it in your device settings."
        );
        setNearestStation(null);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const userCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };

      const allStationsFlattened: StationList[] = [];
      (Object.keys(allLinesStations) as Array<keyof StationMap>).forEach(lineKey => {
        allStationsFlattened.push(...allLinesStations[lineKey]);
      });

      if (allStationsFlattened.length === 0) {
        setNearestStation(null);
        return;
      }
      const validStations = allStationsFlattened.filter(s => typeof s.latitude === 'number' && typeof s.longitude === 'number');
      if (validStations.length === 0) {
        setNearestStation(null);
        return;
      }

      const closest = validStations.reduce((prev, curr) => {
        const prevCoords = { latitude: prev.latitude!, longitude: prev.longitude! };
        const currCoords = { latitude: curr.latitude!, longitude: curr.longitude! };
        const distPrev = haversine(userCoords, prevCoords) || Infinity;
        const distCurr = haversine(userCoords, currCoords) || Infinity;
        return distCurr < distPrev ? curr : prev;
      }, validStations[0]);
      setNearestStation(closest);

    } catch (error: any) {
      Alert.alert("Location Error", "Could not determine location or process station data.");
      setNearestStation(null);
    }
  }, []);

  useEffect(() => {
    getNearestStationFromLocalData();
  }, [getNearestStationFromLocalData]);

  const handleStartJourney = () => {
    router.push('/(tabs)/ride');
  };

  const handleTopUp = () => {
    Alert.alert("Top Up", "Top up functionality is not yet implemented.");
  };

  const handleChangeCard = () => {
    Alert.alert("Change Card", "Change card functionality is not yet implemented.");
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>TravelJuan</Text>
          <TouchableOpacity onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Good morning,</Text>
          <Text style={styles.userName}>{userName}!</Text>
        </View>

        {/* Journey Section */}
        <View style={styles.journeySection}>
          <Image source={require('../../assets/images/beepBG.png')} style={styles.trainImage} resizeMode="cover" />
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Card Balance:</Text>
            <Text style={styles.balanceAmount}>₱ 150.00</Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleStartJourney}>
            <View style={styles.startButtonInner}>
              <Text style={styles.buttonText}>START A JOURNEY</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Buttons Outside Journey Section */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleTopUp}>
            <View style={styles.secondaryButtonInner}>
              <Text style={styles.secondaryButtonText}>Top Up</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleChangeCard}>
            <View style={styles.secondaryButtonInner}>
              <Text style={styles.secondaryButtonText}>Change Card</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Station Section */}
        {nearestStation ? (
          <View style={styles.stationSection}>
            <Text style={styles.stationText}>{nearestStation.name.toUpperCase()}</Text>
            <Text style={styles.nearestText}>Nearest train station</Text>
            <Image source={nearestStation.image} style={styles.stationImage} resizeMode="cover"/>
            <View style={styles.stationDetails}>
              <Text style={styles.detailText}>Crowd: <Text style={{ fontWeight: 'bold', color: 'green' }}>LIGHT</Text></Text>
              <Text style={styles.detailText}>Status: <Text style={{ fontWeight: 'bold', color: 'orange' }}>ARRIVING</Text></Text>
            </View>
          </View>
        ) : (
          <View style={[styles.stationSection, styles.loadingStationSection]}>
            <Ionicons name="navigate-circle-outline" size={30} color="#666" style={{ marginBottom: 10 }} />
            <Text style={styles.nearestText}>Finding nearest station...</Text>
            <Text style={styles.subtleText}>Make sure location services are enabled.</Text>
          </View>
        )}

        {/* Offers Section */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Juan-time Offers!</Text>
          <View style={styles.offersRow}>
            <TouchableOpacity style={styles.offerCard} onPress={() => {
              setAlertModalContent({
                title: "20% OFF",
                message: "This offer is valid until October 17, 2024 for selected routes.",
                buttonText: "Awesome!",
                onButtonPress: undefined
              });
              setIsAlertVisible(true);
            }}>
              <Text style={styles.offerText}>20% OFF</Text>
              <Text style={styles.offerSubtext}>Valid until October 17, 2024</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.offerCard} onPress={() => {
              setAlertModalContent({
                title: "10% OFF",
                message: "Enjoy 10% off your first journey with TravelJuan!",
                buttonText: "Great!",
                onButtonPress: undefined
              });
              setIsAlertVisible(true);
            }}>
              <Text style={styles.offerText}>10% OFF</Text>
              <Text style={styles.offerSubtext}>First time purchase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* AlertModal */}
      <AlertModal
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
        title={alertModalContent.title}
        message={alertModalContent.message}
        buttonText={alertModalContent.buttonText}
        onButtonPress={alertModalContent.onButtonPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  greeting: {
    marginTop: 20,
  },
  greetingText: {
    fontSize: 16,
    color: '#777',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  journeySection: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  trainImage: {
    width: '100%',
    height: 180,
  },
  balanceContainer: {
    padding: 15,
    backgroundColor: '#f4f4f4',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#777',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  startButton: {
    marginTop: 20,
    backgroundColor: '#0097ff',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  startButtonInner: {
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#ddd',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonInner: {
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  stationSection: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 10,
  },
  stationText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nearestText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  stationImage: {
    width: 360,
    height: 180,
    borderRadius: 10,
    marginTop: 15,
  },
  stationDetails: {
    marginTop: 10,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  loadingStationSection: {
    alignItems: 'center',
  },
  offersSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  offerCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  offerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerSubtext: {
    fontSize: 12,
    color: '#777',
  },
  subtleText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
});

export default HomeScreen;
