import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email sai định dạng";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Thành công",
        "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Buoi3"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", error.message);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subtitle}>
        Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
      </Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={styles.inputIcon} />
        <TextInput
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi email đặt lại mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
    color: "#888",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#ff1493",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    textAlign: "center",
    color: "blue",
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
