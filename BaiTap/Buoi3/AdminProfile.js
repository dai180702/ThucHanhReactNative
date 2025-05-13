import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebaseConfig";
import { ref, update, get } from "firebase/database";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../../Config/cloudinaryCongfig";

const AdminProfile = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminInfo, setAdminInfo] = useState({
    name: "Admin",
    email: "",
    phone: "",
    address: "",
    avatar: null,
    role: "admin",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (
      user &&
      user.email !== "abc@gmail.com" &&
      user.email !== "admin@gmail.com"
    ) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Profile" }],
      });
    } else {
      fetchAdminInfo();
    }
  }, []);

  const fetchAdminInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const adminRef = ref(db, `admins/${user.uid}`);
      try {
        const snapshot = await get(adminRef);
        if (snapshot.exists()) {
          setAdminInfo((prev) => ({
            ...prev,
            ...snapshot.val(),
          }));
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    }
  };

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
      aspect: [1, 1],
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
      setAdminInfo((prev) => ({
        ...prev,
        avatar: data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setUploading(true);
      const adminRef = ref(db, `admins/${user.uid}`);
      await update(adminRef, {
        name: adminInfo.name,
        phone: adminInfo.phone,
        address: adminInfo.address,
        avatar: adminInfo.avatar,
        updatedAt: new Date().toLocaleString(),
      });

      Alert.alert("Thành công", "Thông tin đã được cập nhật!", [
        {
          text: "OK",
          onPress: () => {
            setIsEditing(false);
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminProfile" }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setUploading(true);
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert("Thành công", "Mật khẩu đã được thay đổi!", [
        {
          text: "OK",
          onPress: () => {
            setShowChangePassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          },
        },
      ]);
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert(
          "Mật khẩu không đúng",
          "Mật khẩu hiện tại bạn nhập không đúng. Vui lòng kiểm tra lại.",
          [
            {
              text: "Thử lại",
              onPress: () => {
                setCurrentPassword("");
              },
            },
          ]
        );
      } else {
        Alert.alert("Lỗi", "Không thể thay đổi mật khẩu. Vui lòng thử lại.");
      }
    } finally {
      setUploading(false);
    }
  };

  const renderChangePasswordModal = () => {
    return (
      <Modal
        visible={showChangePassword}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowChangePassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.label}>Mật khẩu hiện tại</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Nhập mật khẩu hiện tại"
              />

              <Text style={styles.label}>Mật khẩu mới</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Nhập mật khẩu mới"
              />

              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Nhập lại mật khẩu mới"
              />

              <TouchableOpacity
                style={[
                  styles.updateButton,
                  uploading && styles.buttonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={uploading}
              >
                <Text style={styles.updateButtonText}>
                  {uploading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isEditing && styles.headerEditing]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("home")}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Profile</Text>
        <TouchableOpacity
          style={[styles.editButton, isEditing && styles.editButtonActive]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon name={isEditing ? "check" : "edit"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={[
              styles.imageContainer,
              isEditing && styles.imageContainerEditing,
            ]}
            onPress={isEditing ? pickImage : null}
            disabled={!isEditing}
          >
            <Image
              source={
                adminInfo.avatar
                  ? { uri: adminInfo.avatar }
                  : require("../../img/logolab3.png")
              }
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.editOverlay}>
                <Icon name="camera-alt" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{adminInfo.name}</Text>
          <Text style={styles.userEmail}>{adminInfo.email}</Text>
          <Text style={styles.userRole}>Administrator</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={[styles.infoItem, isEditing && styles.infoItemEditing]}>
            <Icon name="person" size={24} color="#e57373" />
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.inputEditing]}
                value={adminInfo.name}
                onChangeText={(text) =>
                  setAdminInfo((prev) => ({ ...prev, name: text }))
                }
                placeholder="Nhập tên của bạn"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.infoText}>
                {adminInfo.name || "Tên của bạn"}
              </Text>
            )}
          </View>

          <View style={[styles.infoItem, isEditing && styles.infoItemEditing]}>
            <Icon name="phone" size={24} color="#e57373" />
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.inputEditing]}
                value={adminInfo.phone}
                onChangeText={(text) =>
                  setAdminInfo((prev) => ({ ...prev, phone: text }))
                }
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoText}>
                {adminInfo.phone || "Số điện thoại"}
              </Text>
            )}
          </View>

          <View style={[styles.infoItem, isEditing && styles.infoItemEditing]}>
            <Icon name="location-on" size={24} color="#e57373" />
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.inputEditing]}
                value={adminInfo.address}
                onChangeText={(text) =>
                  setAdminInfo((prev) => ({ ...prev, address: text }))
                }
                placeholder="Nhập địa chỉ"
                placeholderTextColor="#999"
                multiline
              />
            ) : (
              <Text style={styles.infoText}>
                {adminInfo.address || "Địa chỉ"}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.infoItem, isEditing && styles.infoItemEditing]}
            onPress={() => setShowChangePassword(true)}
          >
            <Icon name="lock" size={24} color="#e57373" />
            <Text style={styles.infoText}>Đổi mật khẩu</Text>
            <Icon name="chevron-right" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={[styles.updateButton, uploading && styles.buttonDisabled]}
            onPress={handleUpdateProfile}
            disabled={uploading}
          >
            <Text style={styles.updateButtonText}>
              {uploading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderChangePasswordModal()}
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerEditing: {
    backgroundColor: "#d32f2f",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  editButton: {
    position: "absolute",
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  editButtonActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 60,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainerEditing: {
    borderWidth: 3,
    borderColor: "#e57373",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
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
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#e57373",
    fontWeight: "bold",
    backgroundColor: "#ffebee",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  infoItemEditing: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 16,
    paddingVertical: 4,
  },
  inputEditing: {
    borderBottomWidth: 1,
    borderBottomColor: "#e57373",
    paddingVertical: 8,
  },
  updateButton: {
    backgroundColor: "#e57373",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e57373",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fafafa",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});

export default AdminProfile;
