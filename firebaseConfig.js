// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyA3UBlM2jvhL--M8fIE33VDMuZE6_Qneds",
  authDomain: "reactnative-74db1.firebaseapp.com",
  projectId: "reactnative-74db1",
  storageBucket: "reactnative-74db1.appspot.com",
  messagingSenderId: "114035392750",
  appId: "1:114035392750:web:17ccf04226e7fd67d4b3ff",
  databaseURL: "https://reactnative-74db1-default-rtdb.firebaseio.com",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Cung cấp AsyncStorage cho Firebase Auth để lưu trữ trạng thái đăng nhập
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getDatabase(app);
export { auth, db };
