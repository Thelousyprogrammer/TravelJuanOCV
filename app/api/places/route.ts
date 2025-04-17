import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const placesRef = collection(db, 'places');
    const placesSnapshot = await getDocs(placesRef);
    const places = placesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(places);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}