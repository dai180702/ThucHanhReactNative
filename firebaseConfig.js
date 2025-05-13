// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyA3UBlM2jvhL--M8fIE33VDMuZE6_Qneds",
  authDomain: "reactnative-74db1.firebaseapp.com",
  databaseURL: "https://reactnative-74db1-default-rtdb.firebaseio.com",
  projectId: "reactnative-74db1",
  storageBucket: "reactnative-74db1.firebasestorage.app",
  messagingSenderId: "114035392750",
  appId: "1:114035392750:web:17ccf04226e7fd67d4b3ff",
  measurementId: "G-WFQC1MSMQL",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth với persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Khởi tạo Realtime Database
const db = getDatabase(app);

export { app, auth, db };
