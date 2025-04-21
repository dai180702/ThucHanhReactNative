import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";

export default function Project4() {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginBottom: 20,
        }}
      >
        You've pressed the button: {pressCount} time(s){" "}
      </Text>
      <Button
        title={`Pressed ${pressCount} time(s)`}
        onPress={() => setPressCount(pressCount + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 20,
  },
});
