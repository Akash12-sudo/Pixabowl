// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "@react-native-firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTZSt-9PxjFdqABJMZpof_Wf4-MOS40MM",
  authDomain: "instagram-dev-58c0f.firebaseapp.com",
  projectId: "instagram-dev-58c0f",
  storageBucket: "instagram-dev-58c0f.appspot.com",
  messagingSenderId: "538988669227",
  appId: "1:538988669227:web:297c9cf74642a446db7d6e",
  measurementId: "G-2VMX4QGLD0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const storage = getStorage(app);

export const db = getFirestore(app);
