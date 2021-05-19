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
        <View style={styles.searchBarStyle}>
          <Search />
        </View>
        <View style={styles.scrollStyle}>
      <Audiobooks/>
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
    flex: 1,
    backgroundColor: "blue",
  },
  searchBarStyle: {
    bottom: -30,
    backgroundColor: "darkgreen",
  },
  scrollStyle: {
    bottom: -30,
    flex: 8,
    backgroundColor: "lightblue",
  },
  buttonStyle: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
    position: "relative",
  },
});
