import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Explore from "../components/Explore";
import ButtonPanel from "../components/ButtonPanel";
import Audiobooks from "../components/Audiobooks";

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
    backgroundColor: "blue",
  },
  searchBarStyle: {
    backgroundColor: "darkgreen",
  },
  scrollStyle: {
    top: 30,
    height: 610,
    backgroundColor: "lightblue",
  },
  buttonStyle: {
    backgroundColor: "black",
  },
});
