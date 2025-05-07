import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Buoi3" }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require("../../img/logolab3.png")}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Minh Đại</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person" size={24} color="#e57373" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="history" size={24} color="#e57373" />
          <Text style={styles.menuText}>History</Text>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" size={24} color="#e57373" />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#e57373",
    paddingTop: 40,
    paddingBottom: 12,
    marginTop: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e57373",
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default Profile;
