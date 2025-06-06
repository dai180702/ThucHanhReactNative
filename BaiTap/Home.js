import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thực hành phát triển đa nền tảng</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("buoi1")}
      >
        <Text style={styles.text}>Bài tập buổi 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("auth")}
      >
        <Text style={styles.text}>Bài tập buổi 2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("buoi3")}
      >
        <Text style={styles.text}>Bài tập buổi 3</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("buoi4")}
      >
        <Text style={styles.text}>Bài tập buổi 4</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("buoi5")}
      >
        <Text style={styles.text}>Bài tập buổi 5</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#5f9ea0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
});

export default Home;
