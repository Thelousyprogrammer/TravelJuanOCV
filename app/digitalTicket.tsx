import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type DigitalTicketParams = {
  origin?: string;
  destination?: string;
  date?: string;
  ticketNumber?: string;
  ticketType?: string;
  line?: string;
  fare?: string;
};

const formatTicketType = (type?: string) => {
  if (!type) return 'Single Journey';
  const lower = type.toLowerCase();
  if (lower === 'sjt') return 'Single Journey';
  if (lower === 'svc') return 'Stored Value';
  return type;
};

const DigitalTicketScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<DigitalTicketParams>();
  const insets = useSafeAreaInsets();  // Access safe area insets

  const originStation = (params.origin ?? 'Unknown Origin').replace(/ Station$/i, '');
  const destinationStation = (params.destination ?? 'Unknown Destination').replace(/ Station$/i, '');
  const ticketType = formatTicketType(params.ticketType);
  const ticketNumber = params.ticketNumber ?? 'Unavailable';
  const generatedAt = params.date ? new Date(params.date) : new Date();
  const useBeforeDate = generatedAt.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/tickets');
    }
  };

  const handleQrButtonPress = () => {
    Alert.alert('QR Code', 'This feature will display the full-screen QR soon.');
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Digital Ticket</Text>
          <TouchableOpacity onPress={handleQrButtonPress} style={styles.qrButton}>
            <Ionicons name="qr-code-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>Your {ticketType} Ticket is ready, Juan!</Text>
          <Text style={styles.subInstruction}>Tap your phone on the terminal gate to enter.</Text>
        </View>

        {/* Ticket Section */}
        <ImageBackground
          source={{ uri: 'https://via.placeholder.com/350x180?text=Train+Background' }}
          style={styles.ticketContainer}
          imageStyle={styles.ticketImage}
          resizeMode="cover"
        >
          <Text style={styles.ticketTitle}>TravelJuan</Text>
          <Text style={styles.ticketSubtitle}>{ticketType} Ticket</Text>
          <Text style={styles.ticketRoute}>{`${originStation} - ${destinationStation}`}</Text>
        </ImageBackground>

        {/* Journey Info */}
        <View style={styles.journeyInfo}>
          <Text style={styles.sectionTitle}>Journey Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Origin Station:</Text>
            <Text style={styles.infoValue}>{originStation}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Destination:</Text>
            <Text style={styles.infoValue}>{destinationStation}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ticket ID:</Text>
            <Text style={styles.infoValue}>{ticketNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valid Until:</Text>
            <Text style={styles.infoValue}>{useBeforeDate}</Text>
          </View>

          <Text style={styles.note}>
            Single journey tickets are valid only on the day of purchase and must be used within 2 hours of tapping in.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EFF3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#E8EFF3',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500',
    textAlign: 'center',
  },
  qrButton: {
    padding: 5,
  },
  instructionContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subInstruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ticketContainer: {
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    minHeight: 180,
    overflow: 'hidden',
  },
  ticketImage: {
    borderRadius: 12,
    opacity: 0.15,
  },
  ticketTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ticketSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4500',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  ticketRoute: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  journeyInfo: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4500',
    textAlign: 'right',
    flexShrink: 1,
  },
  note: {
    fontSize: 13,
    color: '#666',
    marginTop: 15,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default DigitalTicketScreen;
