import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, update } from "firebase/database";

const BookingManagement = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const bookingsRef = ref(db, "bookings");
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Sắp xếp theo thời gian tạo mới nhất
        list.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setBookings(list);
      } else {
        setBookings([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${bookingId}`);
      await update(bookingRef, { status: newStatus });
      Alert.alert(
        "Thành công",
        `Đã ${newStatus === "approved" ? "duyệt" : "từ chối"} đơn đặt lịch`
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn đặt lịch");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingHeader}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>

      <View style={styles.bookingInfo}>
        <Text style={styles.infoText}>Khách hàng: {item.userEmail}</Text>
        <Text style={styles.infoText}>Ngày: {item.bookingDate}</Text>
        <Text style={styles.infoText}>Giờ: {item.bookingTime}</Text>
        {item.note && <Text style={styles.infoText}>Ghi chú: {item.note}</Text>}
      </View>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleStatusUpdate(item.id, "approved")}
          >
            <Text style={styles.actionButtonText}>Duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusUpdate(item.id, "rejected")}
          >
            <Text style={styles.actionButtonText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý đơn đặt lịch</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  bookingItem: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bookingInfo: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BookingManagement;
