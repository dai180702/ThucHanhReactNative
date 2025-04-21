import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import React from "react";

export default function Project7() {
  const [name, setName] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What is your name?</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholderTextColor="rgba(0,0,0,0.5)"
        placeholder="John Doe"
      />
      <Button
        title="Say Hello"
        onPress={() => {
          alert(`Hello ${name}`);
          setName("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 5,
  },
});
