import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ref, update, remove, get } from "firebase/database";
import { db } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../../Config/cloudinaryCongfig";

const ServiceDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params;

  // Add console log for debugging
  console.log("ServiceDetail rendered with serviceId:", serviceId);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [creationTime, setCreationTime] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [uploading, setUploading] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log("isEditing state changed:", isEditing);
  }, [isEditing]);

  useEffect(() => {
    // Fetch service details from Firebase
    const fetchServiceDetails = async () => {
      const serviceRef = ref(db, `services/${serviceId}`);
      try {
        const snapshot = await get(serviceRef);
        if (snapshot.exists()) {
          const serviceData = snapshot.val();
          setName(serviceData.name || "");
          setPrice(serviceData.price ? serviceData.price.toString() : "0");
          setImageUrl(serviceData.imageUrl || "");
          setCreationTime(serviceData.createdAt || "");
          setUpdateTime(serviceData.updatedAt || "");
        } else {
          Alert.alert("Error", "Service not found!");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
        Alert.alert("Error", "Failed to load service details");
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cho phép truy cập thư viện ảnh"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();
      setImageUrl(data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh. Vui lòng thử lại.");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const formatPrice = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    return "";
  };

  const handlePriceChange = (text) => {
    // Loại bỏ định dạng để lưu giá trị gốc
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);
  };

  const handleUpdateService = async () => {
    if (!name || !price) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Make sure price is a valid number
    const priceValue = parseInt(price);
    if (isNaN(priceValue)) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    const serviceRef = ref(db, `services/${serviceId}`);
    try {
      const currentDate = new Date().toLocaleString();
      await update(serviceRef, {
        name: name.trim(),
        price: priceValue,
        imageUrl: imageUrl,
        updatedAt: currentDate,
      });

      Alert.alert("Cập nhật thành công", "Dịch vụ đã được cập nhật!");
      setIsEditing(false);
      setUpdateTime(currentDate);
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "Could not update service. Please try again.");
    }
  };

  const handleDeleteService = async () => {
    const serviceRef = ref(db, `services/${serviceId}`);
    try {
      await remove(serviceRef);
      Alert.alert("Xóa thành công", "Dịch vụ đã được xóa!");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", "Could not delete service. Please try again.");
    }
  };

  const formatDateTime = (dateTimeString) => {
    return dateTimeString || "N/A";
  };

  const renderDeleteConfirmation = () => {
    return (
      <Modal visible={confirmDelete} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.warningTitle}>Xác nhận</Text>
              <Text style={styles.warningText}>
                Bạn có muốn xóa dịch vụ này không !
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setConfirmDelete(false)}
                >
                  <Text style={styles.cancelButtonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteService}
                >
                  <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service detail</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => {
              console.log("Edit icon pressed");
              setIsEditing(true);
            }}
          >
            <Icon name="edit" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setConfirmDelete(true)}>
            <Icon name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={isEditing ? pickImage : null}
          disabled={!isEditing}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Icon name="add-a-photo" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>
                {isEditing ? "Chọn hình ảnh" : "Không có hình ảnh"}
              </Text>
            </View>
          )}
          {isEditing && (
            <View style={styles.editOverlay}>
              <Icon name="edit" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Service name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Service name"
            editable={isEditing}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={styles.input}
            value={formatPrice(price)}
            onChangeText={handlePriceChange}
            placeholder="Price"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.detailText}>{formatDateTime(creationTime)}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Final update</Text>
          <Text style={styles.detailText}>{formatDateTime(updateTime)}</Text>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={[styles.updateButton, uploading && styles.buttonDisabled]}
            onPress={handleUpdateService}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>
              {uploading ? "Đang cập nhật..." : "Update"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {renderDeleteConfirmation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalContent: {
    padding: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  deleteButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    marginTop: 8,
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderTopLeftRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default ServiceDetail;
