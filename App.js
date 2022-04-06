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

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Audio" component={AudioTracks} />
    </Stack.Navigator>
  )
}

const HistoryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Audio" component={AudioTracks} />
    </Stack.Navigator>
  )
}

const BookshelfNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bookshelf" component={Bookshelf} />
      <Stack.Screen name="Audio" component={AudioTracks} />
    </Stack.Navigator>
  )
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab" component={HomeNavigator} />
        <Tab.Screen name="HistoryTab" component={HistoryNavigator} />
        <Tab.Screen name="BookshelfTab" component={BookshelfNavigator} />
        <Tab.Screen name="SettingsTab" component={Settings} />
      </Tab.Navigator>
      <StatusBar style="light" backgroundColor="" translucent={true} />
    </NavigationContainer>
  );
}

// <Tab.Screen name="Audio" component={AudioTracks} />
// <Tab.Screen name="Downloads" component={Downloads} />
export default App;
