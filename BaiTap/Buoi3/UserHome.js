import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserHome = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        // Kiểm tra nếu là admin thì chuyển về trang admin
        if (user.email === "abc@gmail.com") {
          navigation.reset({
            index: 0,
            routes: [{ name: "HomeSpa" }],
          });
        }
      } else {
        setUserEmail("");
        // Nếu chưa đăng nhập thì chuyển về trang login
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    // Lấy danh sách dịch vụ
    const db = getDatabase();
    const servicesRef = ref(db, "services");
    const unsubscribeServices = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setServices(list);
      } else {
        setServices([]);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeServices();
    };
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceItem}>
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require("../../img/logolab3.png")
        }
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.servicePrice}>{formatPrice(item.price)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MINH ĐẠI</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Icon name="account-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../img/logolab3.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Danh sách dịch vụ */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Danh sách dịch vụ</Text>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderService}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={28} color="#e57373" />
          <Text style={styles.tabLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="attach-money" size={28} color="#888" />
          <Text style={styles.tabLabel}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="people" size={28} color="#888" />
          <Text style={styles.tabLabel}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="settings" size={28} color="#888" />
          <Text style={styles.tabLabel}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e57373",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: 40,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 10,
    marginBottom: -10,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  serviceItem: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    color: "#222",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 15,
    color: "#e57373",
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 12,
    color: "#e57373",
    marginTop: 2,
    fontWeight: "bold",
  },
});

export default UserHome;
