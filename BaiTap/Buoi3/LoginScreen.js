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
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      Alert.alert("Thành công", "Đăng nhập thành công!");
      console.log("User logged in successfully!", userCredential.user);

      // Phân quyền người dùng
      if (
        userCredential.user.email === "abc@gmail.com" ||
        userCredential.user.email === "admin@gmail.com"
      ) {
        navigation.replace("home");
      } else {
        navigation.replace("UserHome");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wellcome Back!</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.forgotPasswordLink}
      >
        <Text style={styles.linkText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <Text
        onPress={() => navigation.navigate("Register")}
        style={styles.linkText}
      >
        Create a new account?
      </Text>
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
  forgotPasswordLink: {
    marginBottom: 10,
  },
});

export default LoginScreen;
