import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import haversine from 'haversine';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faresData, Line, TicketType } from '../../data/lib/fares';
import { stations as allLinesStations, StationList, StationMap } from '../../data/lib/stationData';
import StationMapModal from '../components/StationMapModal';
import { GeneratedTicketData, useTicketStore } from '../stores/ticketStore';

interface JourneySegment {
  line: Line;
  from: string;
  to: string;
  sjt: number | string;
  svc: number | string;
}

// --- Helper Function ---
const normalizeStationName = (name: string): string => {
  return name.replace(/ Station$/i, '').trim();
};

// --- Station Selection Modal Component (Inline or Imported) ---
interface StationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStation: (station: StationList) => void;
  stationsData: StationMap;
}

const StationSelectionModal: React.FC<StationSelectionModalProps> = ({
  visible,
  onClose,
  onSelectStation,
  stationsData,
}) => {
  const insets = useSafeAreaInsets();
  
  const sections = (Object.keys(stationsData) as Line[]).map((line) => ({
    title: line,
    data: stationsData[line],
  }));

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.safeArea}>
        <View style={modalStyles.modalHeader}>
          <Text style={modalStyles.modalTitle}>Select Station</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
             <Text style={modalStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={modalStyles.stationItem}
              onPress={() => onSelectStation(item)}
            >
              <Text style={modalStyles.stationText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={modalStyles.sectionHeader}>{title}</Text>
          )}
          ItemSeparatorComponent={() => <View style={modalStyles.separator} />}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        />
      </SafeAreaView>
    </Modal>
  );
};

// --- Main RideScreen Component ---
const RideScreen = () => {
  // Get safe area insets
  const insets = useSafeAreaInsets();
  
  const [departureStation, setDepartureStation] = useState<StationList | null>(null);
  const [arrivalStation, setArrivalStation] = useState<StationList | null>(null);
  const [computedFare, setComputedFare] = useState<number | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [journeySegments, setJourneySegments] = useState<JourneySegment[]>([]); // Use defined type
  const [generatedTicket, setGeneratedTicket] = useState<GeneratedTicketData | null>(null);

  // Station Map Preview Modal State
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  // Station Selection Modal State
  const [isStationModalVisible, setIsStationModalVisible] = useState(false);
  const [stationSelectionMode, setStationSelectionMode] = useState<'departure' | 'arrival' | null>(null);

  // --- Get Zustand actions ---
  const addTicketToStore = useTicketStore((state) => state.addTicket);

  // --- Initialize the router ---
  const router = useRouter();

  // --- Location and Nearest Station Logic ---
  const getNearestStationFromLocalData = useCallback(async () => {
    setDepartureStation(null);
    setArrivalStation(null);
    setComputedFare(null);
    setGeneratedTicket(null);
    setSelectedTicketType(null);
    setJourneySegments([]);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is needed.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const userCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      console.log('User Coords:', userCoords);

      const allStationsFlattened: StationList[] = [];
      (Object.keys(allLinesStations) as Array<keyof StationMap>).forEach(lineKey => {
        allStationsFlattened.push(...allLinesStations[lineKey]);
      });
      if (allStationsFlattened.length === 0) return;

      const validStations = allStationsFlattened.filter(s => typeof s.latitude === 'number' && typeof s.longitude === 'number');
      if (validStations.length === 0) return;

      const closest = validStations.reduce((prev, curr) => {
        const prevCoords = { latitude: prev.latitude!, longitude: prev.longitude! };
        const currCoords = { latitude: curr.latitude!, longitude: curr.longitude! };
        const distPrev = haversine(userCoords, prevCoords) || Infinity;
        const distCurr = haversine(userCoords, currCoords) || Infinity;
        return distCurr < distPrev ? curr : prev;
      }, validStations[0]);

      console.log('Nearest Station Found:', closest.name);
      setDepartureStation(closest);
    } catch (error) {
      console.error("Error getting nearest station:", error);
      Alert.alert("Error", "Could not determine location or process station data.");
    }
  }, []);

  useEffect(() => {
    getNearestStationFromLocalData();
  }, [getNearestStationFromLocalData]);

  // --- Station Selection Modal Handlers ---
  const handleOpenStationModal = (mode: 'departure' | 'arrival') => {
    setStationSelectionMode(mode);
    setIsStationModalVisible(true);
  };

  const handleSelectStation = (station: StationList) => {
    if (stationSelectionMode === 'departure') {
      setDepartureStation(station);
    } else if (stationSelectionMode === 'arrival') {
      setArrivalStation(station);
    }
    setComputedFare(null);
    setSelectedTicketType(null);
    setJourneySegments([]);
    setGeneratedTicket(null);
    setIsStationModalVisible(false);
    setStationSelectionMode(null);
  };

  // --- Fare Calculation ---
  const handleComputeFare = (ticketType: TicketType) => {
    if (!departureStation || !arrivalStation) {
      Alert.alert("Missing Stations", "Please select both departure and arrival stations.");
      return;
    }
    if (departureStation.line !== arrivalStation.line) {
      Alert.alert("Multi-Line Fare Not Supported", "Please select stations on the same line for fare calculation.");
      setComputedFare(null);
      setSelectedTicketType(null);
      setJourneySegments([]);
      return;
    }

    const line = departureStation.line;
    const fromStationName = normalizeStationName(departureStation.name);
    const toStationName = normalizeStationName(arrivalStation.name);

    if (fromStationName === toStationName) {
         Alert.alert("Same Station", "Departure and arrival stations cannot be the same.");
         setComputedFare(0);
         setSelectedTicketType(ticketType);
         setJourneySegments([]);
         return;
    }

    let sjtFare: number | string = 'N/A';
    let svcFare: number | string = 'N/A';

    try {
        if (line === 'LRT1') {
            sjtFare = faresData.LRT1.SJT[fromStationName as keyof typeof faresData.LRT1.SJT]?.[toStationName as keyof typeof faresData.LRT1.SJT[keyof typeof faresData.LRT1.SJT]] ?? 'N/A';
            svcFare = faresData.LRT1.SVC[fromStationName as keyof typeof faresData.LRT1.SVC]?.[toStationName as keyof typeof faresData.LRT1.SVC[keyof typeof faresData.LRT1.SVC]] ?? 'N/A';
        } else if (line === 'LRT2') {
            sjtFare = faresData.LRT2.SJT[fromStationName as keyof typeof faresData.LRT2.SJT]?.[toStationName as keyof typeof faresData.LRT2.SJT[keyof typeof faresData.LRT2.SJT]] ?? 'N/A';
            svcFare = faresData.LRT2.SVC[fromStationName as keyof typeof faresData.LRT2.SVC]?.[toStationName as keyof typeof faresData.LRT2.SVC[keyof typeof faresData.LRT2.SVC]] ?? 'N/A';
        } else if (line === 'MRT3') {
            sjtFare = faresData.MRT3.SJT[fromStationName as keyof typeof faresData.MRT3.SJT]?.[toStationName as keyof typeof faresData.MRT3.SJT[keyof typeof faresData.MRT3.SJT]] ?? 'N/A';
            svcFare = faresData.MRT3.SVC[fromStationName as keyof typeof faresData.MRT3.SVC]?.[toStationName as keyof typeof faresData.MRT3.SVC[keyof typeof faresData.MRT3.SVC]] ?? 'N/A';
        }
    } catch (e) {
        console.error("Error accessing fare data:", e);
        Alert.alert("Fare Lookup Error", "Could not retrieve fare data.");
        setComputedFare(null); setSelectedTicketType(null); setJourneySegments([]); return;
    }

    let finalFare: number | null = null;
    if (ticketType === 'SJT' && typeof sjtFare === 'number') finalFare = sjtFare;
    else if (ticketType === 'SVC' && typeof svcFare === 'number') finalFare = svcFare;

    if (finalFare === null || sjtFare === 'N/A' || svcFare === 'N/A') {
        console.error(`Fare not found: ${line}: ${fromStationName} -> ${toStationName}. SJT: ${sjtFare}, SVC: ${svcFare}`);
        Alert.alert("Fare Error", `Fare info not found for the selected ${line} route.`);
        setComputedFare(null); setSelectedTicketType(null); setJourneySegments([]);
    } else {
        setComputedFare(finalFare);
        setSelectedTicketType(ticketType);
        // FIX: Use explicit assignment, not shorthand
        setJourneySegments([{
             line: line,
             from: fromStationName,
             to: toStationName,
             sjt: sjtFare, // Assign value of sjtFare
             svc: svcFare  // Assign value of svcFare
        }]);
    }
     setGeneratedTicket(null);
  };

  // --- Ticket Generation ---
  const handleGenerateTicket = () => {
    if (computedFare === null || !selectedTicketType || !departureStation || !arrivalStation || journeySegments.length === 0) {
      Alert.alert("Cannot Generate Ticket", "Calculate a valid fare first.");
      return;
    }
    const newTicket: GeneratedTicketData = { // Use the imported type
      id: `TICKET-${Date.now()}`,
      ticketType: selectedTicketType,
      departureStationName: departureStation.name,
      departureStationLine: departureStation.line,
      arrivalStationName: arrivalStation.name,
      arrivalStationLine: arrivalStation.line,
      journeySegments: journeySegments,
      fare: computedFare,
      generatedAt: new Date().toLocaleString(),
    };

    // Add to store
    addTicketToStore(newTicket);
    console.log("Generated Ticket and added to store:", newTicket);

if (newTicket.ticketType === 'SJT') { // Example: Go to digital ticket for SJT
        Alert.alert(
            "Ticket Generated!",
            "Your digital ticket is ready.",
            [
                { text: "OK" },
                {
                    text: "View Digital Ticket",
                    onPress: () => router.push({
                        pathname: "/digitalTicket",
                        params: {
                            origin: newTicket.departureStationName,
                            destination: newTicket.arrivalStationName,
                            date: newTicket.generatedAt,
                            ticketNumber: newTicket.id,
                            ticketType: newTicket.ticketType,
                            line: newTicket.departureStationLine,
                            fare: newTicket.fare.toString(),
                        },
                    }),
                },
                {
                    text: "Go to My Tickets",
                    onPress: () => router.push('/(tabs)/tickets'),
                    style: 'cancel'
                }
            ]
        );
    } else { // For other types, or if you want a different flow
        Alert.alert(
            "Ticket Generated",
            "Your ticket has been added.",
            [
                { text: "OK" },
                { text: "View Tickets", onPress: () => router.push('/(tabs)/tickets') }
            ]
        );
    }
  };

  // --- Render Logic ---
  return (
    <View style={[styles.container, { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right
    }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, {
        paddingBottom: insets.bottom + 100, // Add extra bottom padding for scroll
      }]}>

        {/* --- Header --- */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>RIDE</Text>
          <TouchableOpacity
            onPress={() => setIsMapModalVisible(true)} // Opens the PREVIEW modal
            style={styles.viewMapButton}
          >
            <Text style={styles.viewMapButtonText}>View All Stations</Text>
          </TouchableOpacity>
        </View>

        {/* --- Departure Station --- */}
        <View style={styles.section}>
          <View style={styles.stationHeaderContainer}>
             <Text style={styles.sectionTitle}>Depart From:</Text>
             <TouchableOpacity onPress={() => handleOpenStationModal('departure')} style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
             </TouchableOpacity>
          </View>
          {departureStation ? (
            <>
              <Text style={styles.station}>{departureStation.name} ({departureStation.line})</Text>
              <Image source={departureStation.image} style={styles.stationImage} resizeMode="cover"/>
            </>
          ) : <Text style={styles.stationLoading}>Finding nearest station...</Text>}
        </View>

        {/* --- Arrival Station --- */}
        <View style={styles.section}>
            <View style={styles.stationHeaderContainer}>
                <Text style={styles.sectionTitle}>Arrive To:</Text>
                <TouchableOpacity onPress={() => handleOpenStationModal('arrival')} style={styles.changeButton}>
                    <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
            </View>
            {arrivalStation ? (
                <>
                <Text style={styles.station}>{arrivalStation.name} ({arrivalStation.line})</Text>
                <Image source={arrivalStation.image} style={styles.stationImage} resizeMode="cover"/>
                </>
            ) : <Text style={styles.stationLoading}>Please select an arrival station.</Text>}
        </View>

        {/* --- Fare Calculation Section --- */}
        {(departureStation && arrivalStation) && (
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>TOTAL FARE</Text>
            <View style={styles.fareCard}>
                {journeySegments.length > 0 ? journeySegments.map((segment, index) => (
                  <Text key={index} style={styles.fareText}>
                      {segment.line} Route: {segment.from} to {segment.to}:
                      <Text style={styles.fareAmount}> P{segment.sjt} (SJT) / P{segment.svc} (SVC)</Text>
                  </Text>
                )) : (
                     <Text style={styles.fareText}>
                        {departureStation?.line === arrivalStation?.line
                           ? `Press "USE SVC" or "USE SJT" to calculate fare for ${departureStation.line}.`
                           : "Select stations on the same line to calculate fare."}
                    </Text>
                )}

                {computedFare !== null && selectedTicketType && (
                  <Text style={styles.totalFareText}>
                      Total Fare ({selectedTicketType}): <Text style={styles.fareAmount}>P{computedFare.toFixed(2)}</Text>
                  </Text>
                )}
            </View>
            {departureStation?.line === arrivalStation?.line && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleComputeFare('SVC')}>
                    <View style={styles.buttonSolid}><Text style={styles.buttonText}>USE SVC</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleComputeFare('SJT')}>
                    <View style={styles.buttonSolid}><Text style={styles.buttonText}>USE SJT</Text></View>
                    </TouchableOpacity>
                </View>
            )}
            {computedFare !== null && selectedTicketType && (
                <TouchableOpacity
                    style={[styles.button, styles.generateTicketButton]}
                    onPress={handleGenerateTicket}
                >
                    <View style={styles.buttonSolidGreen}>
                        <Text style={styles.buttonText}>GENERATE TICKET</Text>
                    </View>
                </TouchableOpacity>
            )}
            </View>
        )}

        {/* --- Generated Ticket Section --- */}
        {generatedTicket && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LAST GENERATED TICKET</Text>
            <View style={styles.ticketCard}>
              <Text style={styles.ticketText}><Text style={styles.ticketLabel}>Ticket ID:</Text> {generatedTicket.id}</Text>
              <Text style={styles.ticketText}><Text style={styles.ticketLabel}>Type:</Text> {generatedTicket.ticketType}</Text>
              <Text style={styles.ticketText}><Text style={styles.ticketLabel}>From:</Text> {generatedTicket.departureStationName} ({generatedTicket.departureStationLine})</Text>
              <Text style={styles.ticketText}><Text style={styles.ticketLabel}>To:</Text> {generatedTicket.arrivalStationName} ({generatedTicket.arrivalStationLine})</Text>
              {generatedTicket.journeySegments.map((segment, index) => (
                <Text key={`ticket-seg-${index}`} style={styles.ticketSegmentText}>
                  Leg {index + 1}: {segment.line} ({segment.from} → {segment.to})
                </Text>
              ))}
              <Text style={styles.ticketTextBold}><Text style={styles.ticketLabel}>Fare:</Text> P{generatedTicket.fare.toFixed(2)}</Text>
              <Text style={styles.ticketText}><Text style={styles.ticketLabel}>Generated:</Text> {generatedTicket.generatedAt}</Text>
              <View style={styles.qrCodePlaceholder}>
                <Text style={styles.qrCodePlaceholderText}>QR PLACEHOLDER</Text> {/* Placeholder for QR Code */}
              </View>
            </View>
          </View>
        )}
      </ScrollView> {/* End of ScrollView */}

      {/* --- Station Selection Modal (For setting fare stations) --- */}
      <StationSelectionModal
        visible={isStationModalVisible}
        onClose={() => setIsStationModalVisible(false)}
        onSelectStation={handleSelectStation}
        stationsData={allLinesStations}
      />

      {/* --- Station Map Modal (For previewing only) --- */}
      <StationMapModal
        visible={isMapModalVisible}
        onClose={() => setIsMapModalVisible(false)}
        stationsData={allLinesStations}
      />
    </View> // End of main container View
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFE7E9', // Light background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: '#A1B7B8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B3A3A',
  },
  viewMapButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#DF543B',
    borderRadius: 5,
  },
  viewMapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  stationHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DF543B',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#A1B7B8',
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#3B3A3A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  station: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3B3A3A',
    marginBottom: 10,
    textAlign: 'center',
  },
  stationLoading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  stationImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'center',
    backgroundColor: '#D0DCE0',
  },
  fareCard: {
    backgroundColor: '#F3F6F7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  fareText: {
    fontSize: 15,
    color: '#3B3A3A',
    marginBottom: 8,
    lineHeight: 22,
  },
  totalFareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B3A3A',
    marginTop: 10,
  },
  fareAmount: {
    color: '#DF543B',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonSolid: {
    backgroundColor: '#DF543B',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  generateTicketButton: {
    marginTop: 10,
    marginHorizontal: 5,
  },
  buttonSolidGreen: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  ticketCard: {
    backgroundColor: '#F3F6F7',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  ticketLabel: {
    fontWeight: 'bold',
    color: '#3B3A3A',
  },
  ticketText: {
    fontSize: 15,
    color: '#3B3A3A',
    marginBottom: 6,
    lineHeight: 22,
  },
  ticketTextBold: {
    fontSize: 16,
    color: '#3B3A3A',
    marginBottom: 6,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  ticketSegmentText: {
    fontSize: 14,
    color: '#5A5A5A',
    marginLeft: 10,
    marginBottom: 4,
  },
  qrCodePlaceholder: {
    height: 100,
    width: 100,
    backgroundColor: '#E0E6E8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#C0C8CA',
  },
  qrCodePlaceholderText: {
    color: '#3B3A3A',
    fontSize: 12,
  },
});
const modalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DFE7E9',
  },
  modalHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C0D0D4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B3A3A',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#DF543B',
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DF543B',
    backgroundColor: '#E6EFF0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  stationItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  stationText: {
    fontSize: 16,
    color: '#3B3A3A',
  },
  separator: {
    height: 1,
    backgroundColor: '#D0DCE0',
    marginLeft: 20,
  },
});

export default RideScreen;