import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Explore from "../components/Explore";

function App() {
  return (
    <View style={styles.container}>
      <View>
        <Explore />
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    backgroundColor: "darkgreen",
  },
  searchBarStyle: {
    backgroundColor: "darkgreen",
  },
  scrollStyle: {
    height: 590,
    backgroundColor: "lightblue",
  },
  buttonStyle: {
    backgroundColor: "black",
  },
});
