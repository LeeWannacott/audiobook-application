import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Search from "./src/components/SearchBar";
import ButtonPanel from "./src/components/ButtonPanel";
import Audiobooks from "./src/components/Audiobooks";
import { WebView } from "react-native-webview";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 2,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    // const component1 = () => <Icon name="flag" color={selectedIndex === 0 ? '#fff' : '#000'} />;
    // const buttons = ["Explore","Favourites", "History"];

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
