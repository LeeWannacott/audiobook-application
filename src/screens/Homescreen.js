import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Search from "../components/SearchBar";
import ButtonPanel from "../components/ButtonPanel";
import Audiobooks from "../components/Audiobooks";

export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scrollStyle}>
          <Search />
        </View>
        <View style={styles.buttonStyle}>
          <ButtonPanel />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: 10,
    backgroundColor: "blue",
  },
  searchBarStyle: {
    backgroundColor: "darkgreen",
  },
  scrollStyle: {
    top: 30,
    flex: 8,
    backgroundColor: "lightblue",
  },
  buttonStyle: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: "black",
  },
});
