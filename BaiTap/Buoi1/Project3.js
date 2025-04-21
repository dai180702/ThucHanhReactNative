import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function Project3() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => alert("Hello!")} style={styles.button1}>
        <Text style={styles.text}>Say hello</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert("goodbye!")} style={styles.button2}>
        <Text style={styles.text}>Say goodbye</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button1: {
    backgroundColor: "#ff637c",
    alignSelf: "center",
    padding: 10,
    margin: 10

  },

  button2: {
    backgroundColor: "#4dc2c2",
    alignSelf: "center",
    padding: 10,
    margin: 10
  },

  text: {
    fontSize: 18,
  }
});
