import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Project1() {
  return (
    <View  style={style.container}>
      <Text style={style.text}>Hello world</Text>
    </View>
  );
}

const style = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        backgroundColor: "aqua",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#black",
        fontSize: 16,
    }
});
