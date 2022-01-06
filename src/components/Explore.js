import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { View, Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import ButtonPanel from "../components/ButtonPanel";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

function Search() {
  const [search, updateSearch] = useState("");

  return (
    <View>
      <View style={styles.searchBarAndSettingsIcon}>
        <View style={styles.searchStyle}>
          <SearchBar
            placeholder="Search for AudioBook.."
            onChangeText={updateSearch}
            value={search}
    inputContainerStyle={{marginRight:-7}}
          />
        </View>
        <MaterialIconCommunity name="cog" size={45} color="white" style={styles.settingsIcon}  />
      </View>
      <View style={styles.scrollStyle}>
        <AudioBooks searchBarInput={search} />
      </View>
      <View style={styles.buttonStyle}>
        <ButtonPanel buttonPressedIndex={0} />
      </View>
    </View>
  );
}

{
}

const windowWidth = Dimensions.get("window").width;
export default Search;
const styles = StyleSheet.create({
  searchBarAndSettingsIcon: {
    display:"flex",
    flexDirection:"row",
    width: windowWidth - 20,
    top:20,
    backgroundColor:"rgb(57, 62, 66)"
  },
  searchStyle: {
    width: windowWidth - 80,
    top:-1,
    backgroundColor: "darkgreen",
  },
  settingsIcon:{
    backgroundColor:"red",
    marginLeft:"auto",
    marginRight:"auto",
    marginTop:"auto",
    marginBottom:"auto",
    borderRadius:3,
    borderWidth:1,
  },
  buttonStyle: {
    paddingTop: 0,
  },
  scrollStyle: {
    top: 20,
    height: 600,
    backgroundColor: "black",
  },
});
