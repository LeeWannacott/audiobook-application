import HomeScreen from "./src/screens/Homescreen";
import AudioTracks from "./src/screens/Audiotracks";
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Audio" component={AudioTracks}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
