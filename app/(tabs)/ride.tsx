import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const App = () => {
  const [departureStation, setDepartureStation] = useState('LRT - 2 ANONAS STATION');
  const [ticketType, setTicketType] = useState(null); // 'SJT' or 'SVC'
  const [totalFare, setTotalFare] = useState(null);

  // Fare data based on the image
  const fares = {
    'LRT - 2 ANONAS STATION': {
      'LRT - 1 CARRIEDO STATION': {
        'LRT-2': { SJT: 25, SVC: 25 }, // Anonas to Recto
        'LRT-1': { SJT: 15, SVC: 14 }, // Doroteo Jose to Carriedo
      },
    },
  };

  const computeTotalFare = (type: 'SJT' | 'SVC') => {
    setTicketType(type);
    const fareData = fares[departureStation]['LRT - 1 CARRIEDO STATION'];
    const lrt2Fare = fareData['LRT-2'][type];
    const lrt1Fare = fareData['LRT-1'][type];
    const total = lrt2Fare + lrt1Fare;
    setTotalFare(total);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>RIDE</Text>
        </View>

        {/* Depart From Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Depart From:</Text>
          <Text style={styles.station}>{departureStation}</Text>
          <Image
            source={{ uri: '../../assets/images/LRT2/Anonas.jpg' }} // Replace with your image
            style={styles.stationImage}
          />
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>CROWD DENSITY: <Text style={styles.light}>LIGHT</Text></Text>
            <Text style={styles.statusText}>STATUS: <Text style={styles.departing}>TRAIN DEPARTING</Text></Text>
          </View>
        </View>

        {/* Arrive To Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arrive To:</Text>
          <Text style={styles.station}>LRT - 1 CARRIEDO STATION</Text>
          <Image
            source={{ uri: '../../assets/images/LRT1/Carriedo.jpg' }} // Replace with your image
            style={styles.stationImage}
          />
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>CROWD DENSITY: <Text style={styles.average}>AVERAGE</Text></Text>
            <Text style={styles.statusText}>STATUS: <Text style={styles.arriving}>TRAIN ARRIVING</Text></Text>
          </View>
        </View>

        {/* Total Fare Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOTAL FARE</Text>
          <View style={styles.fareCard}>
            <Text style={styles.fareText}>
              LRT - 2 Route: Anonas to Recto: <Text style={styles.fareAmount}>P25 (SJT) / P25 (SVC)</Text>
            </Text>
            <Text style={styles.fareText}>
              LRT - 1 Route: Doroteo Jose to Carriedo: <Text style={styles.fareAmount}>P15 (SJT) / P14 (SVC)</Text>
            </Text>
            {totalFare && (
              <Text style={styles.totalFareText}>
                Total Fare ({ticketType}): <Text style={styles.fareAmount}>P{totalFare}</Text>
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => computeTotalFare('SVC')}
            >
              <View style={styles.buttonSolid}>
                <Text style={styles.buttonText}>USE SVC</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => computeTotalFare('SJT')}
            >
              <View style={styles.buttonSolid}>
                <Text style={styles.buttonText}>USE SJT</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Space for bottom nav
  },
  headerContainer: {
    backgroundColor: '#2A3B4C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#2A3B4C',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF00FF',
    marginBottom: 8,
  },
  station: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  stationImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#D3D3D3',
    fontWeight: '400',
  },
  light: {
    color: '#00FF00',
    fontWeight: '600',
  },
  average: {
    color: '#FFFF00',
    fontWeight: '600',
  },
  departing: {
    color: '#00FF00',
    fontWeight: '600',
  },
  arriving: {
    color: '#FFFF00',
    fontWeight: '600',
  },
  fareCard: {
    backgroundColor: '#3A4B5C',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  fareText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  totalFareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  fareAmount: {
    color: '#FF00FF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSolid: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2A3B4C',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default App;