// src/stores/ticketStore.ts
import { create } from 'zustand';
import { Line, TicketType } from '../../data/lib/fares'; // Adjust path if needed

// Re-use or import the interfaces defined earlier
interface JourneySegment {
  line: Line;
  from: string;
  to: string;
  sjt: number | string;
  svc: number | string;
}

interface GeneratedTicketData {
  id: string;
  ticketType: TicketType;
  departureStationName: string;
  departureStationLine: Line;
  arrivalStationName: string;
  arrivalStationLine: Line;
  journeySegments: JourneySegment[];
  fare: number;
  generatedAt: string; // Use string from toLocaleString()
  // Add other fields like qrCodeData later if needed
}

// Define the state structure for the store
interface TicketState {
  activeTickets: GeneratedTicketData[];
  addTicket: (ticket: GeneratedTicketData) => void;
  // removeTicket: (ticketId: string) => void; // Add later if needed
  // clearTickets: () => void; // Add later if needed
}

// Create the store
export const useTicketStore = create<TicketState>((set) => ({
  // Initial state: an empty array of tickets
  activeTickets: [],

  // Action to add a new ticket
  addTicket: (ticket) => set((state) => ({
    activeTickets: [...state.activeTickets, ticket] // Add new ticket to the end of the array
  })),

  // Example remove action (implement later if necessary)
  // removeTicket: (ticketId) => set((state) => ({
  //   activeTickets: state.activeTickets.filter((t) => t.id !== ticketId),
  // })),

  // Example clear action (implement later if necessary)
  // clearTickets: () => set({ activeTickets: [] }),
}));

// Export the type for use in components if needed elsewhere
export type { GeneratedTicketData };
