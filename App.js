import React from "react";
import Home from "./BaiTap/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Lab1 from "./BaiTap/Buoi1/Lab1";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={Home}
        />
        <Stack.Screen name="buoi1" component={Lab1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
