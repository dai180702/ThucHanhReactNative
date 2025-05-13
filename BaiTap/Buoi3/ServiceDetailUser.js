import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDatabase, ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ServiceDetailUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { service } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [note, setNote] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const formatPrice = (price) => {
    if (!price) return "0đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (date) => {
    const formattedDate = date.toLocaleDateString("vi-VN");
    setBookingDate(formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirmTime = (time) => {
    const formattedTime = time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setBookingTime(formattedTime);
    hideTimePicker();
  };

  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày và giờ đặt lịch");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để đặt lịch");
        return;
      }

      const db = getDatabase();
      const bookingsRef = ref(db, "bookings");

      const newBooking = {
        userId: user.uid,
        userEmail: user.email,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        bookingDate,
        bookingTime,
        note,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await push(bookingsRef, newBooking);
      Alert.alert("Thành công", "Đặt lịch thành công!");
      setModalVisible(false);
      setBookingDate("");
      setBookingTime("");
      setNote("");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết dịch vụ</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Service Image */}
        <Image
          source={
            service.imageUrl
              ? { uri: service.imageUrl }
              : require("../../img/logolab3.png")
          }
          style={styles.serviceImage}
          resizeMode="cover"
        />

        {/* Service Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Mô tả dịch vụ:</Text>
            <Text style={styles.description}>
              {service.description || "Chưa có mô tả"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đặt lịch dịch vụ</Text>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={showDatePicker}
            >
              <Text style={styles.dateTimeButtonText}>
                {bookingDate || "Chọn ngày đặt lịch"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={showTimePicker}
            >
              <Text style={styles.dateTimeButtonText}>
                {bookingTime || "Chọn giờ đặt lịch"}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Ghi chú (không bắt buộc)"
              value={note}
              onChangeText={setNote}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleBooking}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
        locale="vi-VN"
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
        locale="vi-VN"
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
  serviceImage: {
    width: "100%",
    height: 250,
  },
  infoContainer: {
    padding: 16,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 20,
    color: "#e57373",
    fontWeight: "bold",
    marginBottom: 16,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  bookButton: {
    backgroundColor: "#e57373",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  noteInput: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#e57373",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButtonText: {
    color: "#fff",
  },
});

export default ServiceDetailUser;
