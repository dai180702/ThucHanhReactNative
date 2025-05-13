import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";

const HomeSpa = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const servicesRef = ref(db, "services");
    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setServices(list);
        setFilteredServices(list);
      } else {
        setServices([]);
        setFilteredServices([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const formatPrice = (price) => {
    if (!price) return "0đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() =>
        navigation.navigate("ServiceDetail", { serviceId: item.id })
      }
    >
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
    </TouchableOpacity>
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
        {/* <Text style={styles.logoText}>KAMI SPA</Text> */}
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm dịch vụ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {/* Danh sách dịch vụ */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Danh sách dịch vụ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("add")}
        >
          <Icon name="add-circle" size={32} color="#e57373" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredServices}
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
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("BookingManagement")}
        >
          <Icon name="receipt" size={28} color="#888" />
          <Text style={styles.tabLabel}>Đơn hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("add")}
        >
          <Icon name="add-circle" size={28} color="#888" />
          <Text style={styles.tabLabel}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="person" size={28} color="#888" />
          <Text style={styles.tabLabel}>Profile</Text>
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
  logoText: {
    fontSize: 22,
    color: "#e57373",
    fontWeight: "bold",
    marginTop: -10,
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
  addButton: {
    marginLeft: 8,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
});

export default HomeSpa;
