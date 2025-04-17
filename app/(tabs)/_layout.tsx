// App.js - Main React Native Application
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootTabParamList = {
  Home: undefined;
  Ride: undefined;
  Tickets: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Mock user data for demo purposes
const mockUserData = {
  name: 'Juan Dela Cruz',
  balance: 463.00,
  cardNumber: 'XXXX-XXXX-XXXX-1234',
};

// Home Screen Component
const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [userData, setUserData] = useState(mockUserData);
  const [station, setStation] = useState({
    name: 'Anonas Station',
    description: 'Nearest Train Station',
    crowdDensity: 'Light',
    status: 'Train Departing'
  });
  
  // Simulating time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>TravelJuan</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Greeting & Card Balance */}
      <View style={styles.cardContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.username}>{userData.name}</Text>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Card Balance</Text>
          <Text style={styles.balanceAmount}>₱{userData.balance.toFixed(2)}</Text>
          <Image
            source={require('../../assets/images/train-icon.png')}
            style={styles.trainIcon}
          />
        </View>
        
        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.journeyButton}
          onPress={() => navigation.navigate('Ride')}
        >
          <Text style={styles.journeyButtonText}>Start a Journey</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtonsContainer}>
          <TouchableOpacity 
            style={styles.topUpButton}
            onPress={() => {
              // Mock top-up functionality
              setUserData(prevData => ({
                ...prevData,
                balance: prevData.balance + 100
              }));
            }}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.changeCardButton}>
            <Text style={styles.changeCardButtonText}>Change Card</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Nearest Station Section */}
      <View style={styles.stationContainer}>
        <View style={styles.stationHeader}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.stationDescription}>{station.description}</Text>
        </View>
        
        <View style={styles.stationImageContainer}>
          <Image
            source={require('../../assets/images/station-image.jpg')}
            style={styles.stationImage}
          />
          <View style={styles.stationInfoOverlay}>
            <View style={styles.crowdContainer}>
              <Text style={styles.crowdLabel}>Crowd Density:</Text>
              <Text style={[styles.crowdValue, { color: '#4CAF50' }]}>
                {station.crowdDensity}
              </Text>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={styles.statusValue}>{station.status}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Promotional Offers */}
      <View style={styles.offersContainer}>
        <View style={styles.offersHeader}>
          <Text style={styles.offersTitle}>Juan-time Offers</Text>
          <Text style={styles.offersSubtitle}>Don't miss the Chance!</Text>
        </View>
        
        <View style={styles.offersGrid}>
          <View style={styles.offerCard}>
            <Text style={styles.offerPercentage}>20% OFF</Text>
            <Text style={styles.offerDetails}>SJT tickets</Text>
            <Text style={styles.offerExpiry}>Valid until October 17, 2024</Text>
          </View>
          
          <View style={styles.offerCard}>
            <Text style={styles.offerPercentage}>10% OFF</Text>
            <Text style={styles.offerDetails}>SVC and SJT</Text>
            <Text style={styles.offerExpiry}>First-time Purchase</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Ride Screen Component
const RideScreen = () => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <Text style={styles.header}>Where are we off to?</Text>
      <Text style={styles.subHeader}>Plan your ride efficiently.</Text>
      
      <View style={styles.routeContainer}>
        <View style={styles.stationField}>
          <Text style={styles.stationFieldLabel}>From:</Text>
          <TouchableOpacity style={styles.stationSelector}>
            <Text>Anonas Station</Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.stationField}>
          <Text style={styles.stationFieldLabel}>To:</Text>
          <TouchableOpacity style={styles.stationSelector}>
            <Text>Select Destination</Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.journeyButton}>
          <Text style={styles.journeyButtonText}>Find Routes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Tickets Screen Component
const TicketsScreen = () => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <Text style={styles.header}>Your Tickets</Text>
      <Text style={styles.subHeader}>Manage your active tickets and balance.</Text>
      
      <View style={styles.ticketContainer}>
        <Text style={styles.noTicketsText}>You have no active tickets</Text>
        <TouchableOpacity style={styles.journeyButton}>
          <Text style={styles.journeyButtonText}>Purchase Ticket</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Profile Screen Component
const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={80} color="#333" />
        <Text style={styles.header}>{mockUserData.name}</Text>
        <Text style={styles.cardNumber}>Card: {mockUserData.cardNumber}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="card-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Payment Methods</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="settings-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Main App Component
export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName = 'home-outline';  // Initialize with default value

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ride') {
            iconName = focused ? 'bus' : 'bus-outline';
          } else if (route.name === 'Tickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF5722',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ride" component={RideScreen} />
      <Tab.Screen name="Tickets" component={TicketsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    backgroundColor: '#e0f2f1',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  greetingContainer: {
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trainIcon: {
    width: 60,
    height: 30,
    marginLeft: 'auto',
  },
  journeyButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  journeyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topUpButton: {
    backgroundColor: '#555',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  topUpButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  changeCardButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  changeCardButtonText: {
    color: '#333',
    fontSize: 16,
  },
  stationContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  stationHeader: {
    padding: 16,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stationDescription: {
    fontSize: 14,
    color: '#666',
  },
  stationImageContainer: {
    position: 'relative',
  },
  stationImage: {
    width: '100%',
    height: 150,
  },
  stationInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  crowdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crowdLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  crowdValue: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  statusValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  offersContainer: {
    margin: 16,
  },
  offersHeader: {
    marginBottom: 12,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  offersSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  offersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    height: 120,
    marginRight: 8,
  },
  offerPercentage: {
    color: '#FF5722',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  offerDetails: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  offerExpiry: {
    color: '#aaa',
    fontSize: 12,
  },
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  routeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  stationField: {
    marginBottom: 16,
  },
  stationFieldLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  stationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  ticketContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTicketsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cardNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
  },
});