import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebaseConfig";

const AddService = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const navigation = useNavigation();

  // Hàm định dạng giá tiền với dấu chấm ngăn cách hàng nghìn
  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    return "";
  };

  // Hàm xử lý khi người dùng nhập giá
  const handlePriceChange = (text) => {
    // Loại bỏ định dạng để lưu giá trị gốc
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);

    // Cập nhật giá trị định dạng để hiển thị
    setFormattedPrice(formatCurrency(numericValue));
  };

  const handleAddService = async () => {
    console.log("Bắt đầu thêm dịch vụ");

    // Kiểm tra xem các trường nhập liệu có hợp lệ không
    if (!name || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Tạo tham chiếu đến vị trí trong Firebase Realtime Database
    const servicesRef = ref(db, "services");

    // Lấy thời gian hiện tại
    const currentDate = new Date().toLocaleString();

    try {
      // In ra dữ liệu trước khi gửi lên Firebase
      console.log("Dữ liệu sẽ gửi lên Firebase:", {
        name: name.trim(),
        price: parseInt(price),
        formattedPrice: formattedPrice,
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      // Gửi dữ liệu lên Firebase
      await push(servicesRef, {
        name: name.trim(),
        price: parseInt(price),
        formattedPrice: formattedPrice,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      
      // Xử lý thông báo khi thành công
      Alert.alert("Thành công", "Dịch vụ đã được thêm!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể thêm dịch vụ. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Dịch Vụ Mới</Text>

      <Text style={styles.label}>Tên dịch vụ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên dịch vụ"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Giá tiền (VNĐ)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá tiền"
        value={formattedPrice}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleAddService}>
        <Text style={styles.buttonText}>Thêm Dịch Vụ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e57373",
    marginBottom: 24,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#e57373",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddService;