import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import ButtonPanel from "../components/ButtonPanel";

function Search(props) {
  const [search, updateSearch] = useState("");

  return (
    <View>
      <View style={styles.searchStyle}>
        <SearchBar
          placeholder="Search for AudioBook.."
          onChangeText={updateSearch}
          value={search}
        />
      </View>
      <View style={styles.scrollStyle}>
        <AudioBooks searchBarInput={search} />
      </View>
      <View>
        <ButtonPanel buttonPressedIndex={0} />
      </View>
    </View>
  );
}

export default Search;
const styles = StyleSheet.create({
  searchStyle: {
    top: 20,
    backgroundColor: "darkgreen",
  },
  scrollStyle: {
    top: 20,
    height: 600,
    backgroundColor: "lightblue",
  },
});
