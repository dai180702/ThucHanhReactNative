import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Project2() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => alert("Hello!")} style={styles.button}>
        <Text style={styles.text}>Hello 1</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 100
  },

  button: {
    backgroundColor: "blue",
    alignItems: "center",
    padding: 10,   
  },

  text: {
    color: "white",
    fontSize: 20
  },
});
