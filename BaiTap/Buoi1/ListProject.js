import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function ListProject({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập buổi 1</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project1")}
      >
        <Text style={styles.text}>Project 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project2")}
      >
        <Text style={styles.text}>Project 2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project3")}
      >
        <Text style={styles.text}>Project 3</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project4")}
      >
        <Text style={styles.text}>Project 4</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project5")}
      >
        <Text style={styles.text}>Project 5</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project6")}
      >
        <Text style={styles.text}>Project 6</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project7")}
      >
        <Text style={styles.text}>Project 7</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("project8")}
      >
        <Text style={styles.text}>Project 8</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#9699FE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
});
