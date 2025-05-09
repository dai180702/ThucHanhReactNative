import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email sai định dạng";
    }
    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải trên 6 ký tự";
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      Alert.alert("Thành công", "Đăng ký thành công!");
      console.log("User registered successfully!", userCredential.user);

      // Phân quyền người dùng
      if (
        userCredential.user.email === "abc@gmail.com" ||
        userCredential.user.email === "admin@gmail.com"
      ) {
        navigation.replace("Buoi3");
      } else {
        navigation.replace("Buoi3");
      }
    } catch (error) {
      let errorMessage = "Đăng ký thất bại";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email đã được sử dụng";
          break;
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/weak-password":
          errorMessage = "Mật khẩu quá yếu";
          break;
        default:
          errorMessage = error.message;
      }
      Alert.alert("Lỗi", errorMessage);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new account!</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} style={styles.inputIcon} />
        <TextInput
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} style={styles.inputIcon} />
        <TextInput
          placeholder="Enter password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            style={styles.inputIcon}
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} style={styles.inputIcon} />
        <TextInput
          placeholder="Confirm password"
          value={confirmPassword}
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon
            name={showConfirmPassword ? "eye" : "eye-slash"}
            size={20}
            style={styles.inputIcon}
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>SignUp</Text>
      </TouchableOpacity>
      <Text
        onPress={() => navigation.navigate("Buoi3")}
        style={styles.linkText}
      >
        Already have an account!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
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
    paddingVertical: 10,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "blue",
  },
});

export default RegisterScreen;
