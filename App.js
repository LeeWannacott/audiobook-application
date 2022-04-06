import HomeScreen from "./src/screens/Homescreen";
import AudioTracks from "./src/screens/Audiotracks";
import History from "./src/screens/History";
import Bookshelf from "./src/screens/Bookshelf";
import Settings from "./src/screens/Settings";
import Downloads from "./src/screens/Downloads";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-search"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bookshelf"
        component={Bookshelf}
        options={{
          tabBarLabel: "Bookshelf",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-cog"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabs" component={TabNavigation} />
        <Stack.Screen name="Audio" component={AudioTracks} />
      </Stack.Navigator>
      <StatusBar style="light" backgroundColor="" translucent={true} />
    </NavigationContainer>
  );
}

// <Tab.Screen name="Audio" component={AudioTracks} />
// <Tab.Screen name="Downloads" component={Downloads} />
export default App;
