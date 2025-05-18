import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

const appInstance = getApp();
const authInstance = getAuth(appInstance);
const firestoreInstance = getFirestore(appInstance);
const storageInstance = getStorage(appInstance);

export {
  appInstance as app, // Uses getApp()
  authInstance as auth, // Uses getAuth(app)
  firestoreInstance as db, // Uses getFirestore(app)
  storageInstance as storage // Uses getStorage(app)
};
