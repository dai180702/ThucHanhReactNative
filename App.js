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
import Caculator from "./BaiTap/Buoi1/Caculator";
import ContactsNavigator from "./BaiTap/Buoi2/routes";
import Options from "./BaiTap/Buoi2/Options";
import LoginScreen from "./BaiTap/Buoi3/LoginScreen";
import RegisterScreen from "./BaiTap/Buoi3/RegisterScreen";
import HomeSpa from "./BaiTap/Buoi3/HomeSpa";
import AddService from "./BaiTap/Buoi3/AddService";
import ServiceDetail from "./BaiTap/Buoi3/ServiceDetail";
import Profile from "./BaiTap/Buoi3/Profile";
import UserHome from "./BaiTap/Buoi3/UserHome";
import AdminProfile from "./BaiTap/Buoi3/AdminProfile";
import ForgotPasswordScreen from "./BaiTap/Buoi3/ForgotPasswordScreen";
import ServiceDetailUser from "./BaiTap/Buoi3/ServiceDetailUser";
import BookingManagement from "./BaiTap/Buoi3/BookingManagement";
import UserBookings from "./BaiTap/Buoi3/UserBookings";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={Home}
        />
        <Stack.Screen name="buoi1" component={Buoi1Navigation} />
        <Stack.Screen name="auth" component={Buoi2Navigation} />
        <Stack.Screen name="buoi3" component={Buoi3Navigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Buoi1Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ListProject"
        component={ListProject}
        options={{ title: "Bài tập buổi 1" }}
      />
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
      <Stack.Screen
        name="homework"
        component={Caculator}
        options={{ title: "calculator" }}
      />
    </Stack.Navigator>
  );
};

const Buoi2Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Buoi2"
        component={ContactsNavigator}
        options={{ headerShown: false, title: "Bài tập buổi 2" }}
      />
      <Stack.Screen
        name="Options"
        component={Options}
        options={{ title: "Options" }}
      />
    </Stack.Navigator>
  );
};

const Buoi3Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Buoi3"
        component={LoginScreen}
        options={{ headerShown: false, title: "Bài tập buổi 3" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Register" }}
      />
      <Stack.Screen
        name="home"
        component={HomeSpa}
        options={{ headerShown: false, title: "Home" }}
      />

      <Stack.Screen
        name="add"
        component={AddService}
        options={{ headerShown: false, title: "Add" }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetail}
        options={{ title: "Chi tiết dịch vụ", headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="UserHome"
        component={UserHome}
        options={{ headerShown: false, title: "UserHome" }}
      />
      <Stack.Screen
        name="AdminProfile"
        component={AdminProfile}
        options={{ title: "Admin Profile", headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password", headerShown: false }}
      />
      {/* <Stack.Screen
        name="ServiceDetailUser"
        component={ServiceDetailScreen}
        options={{ title: "Chi tiết dịch vụ", headerShown: false }}
      /> */}
      <Stack.Screen
        name="ServiceDetailUser"
        component={ServiceDetailUser}
        options={{ title: "Chi tiết dịch vụ", headerShown: false }}
      />
      <Stack.Screen
        name="BookingManagement"
        component={BookingManagement}
        options={{ title: "Quản lý đặt lịch", headerShown: false }}
      />
      <Stack.Screen
        name="UserBookings"
        component={UserBookings}
        options={{ title: "Quản lý đặt lịch", headerShown: false }}
      />
    </Stack.Navigator>
  );
};
