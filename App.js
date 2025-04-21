import React from "react";
import Home from "./BaiTap/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Project1 from "./BaiTap/Buoi1/Project1";
import ListProject from "./BaiTap/Buoi1/ListProject";
import Project2 from "./BaiTap/Buoi1/Project2";
import Project3 from "./BaiTap/Buoi1/Project3";
import Project4 from "./BaiTap/Buoi1/Project4";
import Project5 from "./BaiTap/Buoi1/Project5";
import Project6 from "./BaiTap/Buoi1/Project6";
import Project7 from "./BaiTap/Buoi1/Project7";
import Project8 from "./BaiTap/Buoi1/Project8";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={Home}
        />
        <Stack.Screen name="buoi1" component={ListProject} />
        <Stack.Screen
          name="project1"
          component={Project1}
          options={{ title: "Project 1" }}
        />
        <Stack.Screen
          name="project2"
          component={Project2}
          options={{ title: "Project 2" }}
        />
        <Stack.Screen
          name="project3"
          component={Project3}
          options={{ title: "Project 3" }}
        />
        <Stack.Screen
          name="project4"
          component={Project4}
          options={{ title: "Project 4" }}
        />
        <Stack.Screen
          name="project5"
          component={Project5}
          options={{ title: "Project 5" }}
        />
        <Stack.Screen
          name="project6"
          component={Project6}
          options={{ title: "Project 6" }}
        />
        <Stack.Screen
          name="project7"
          component={Project7}
          options={{ title: "Project 7" }}
        />
        <Stack.Screen
          name="project8"
          component={Project8}
          options={{ title: "Project 8" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
