import React, { useState } from "react";
import { SearchBar, Overlay, CheckBox, Slider } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { View, Dimensions, Text } from "react-native";
import { StyleSheet } from "react-native";
import ButtonPanel from "../components/ButtonPanel";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

function Search() {
  const [search, updateSearch] = useState("");
  const [userInputEntered, setUserInputEntered] = useState("");
  const [requestAudiobookAmount, setRequestAudiobookAmount] = useState(26);
  const [authorLastName, setAuthorLastName] = useState("dickens");
  // const [search, setRequestAudiobookAmount] = useState("*")
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  function apiFunction(value) {
    setRequestAudiobookAmount(value);
  }

  return (
    <View>
      <View style={styles.searchBarAndSettingsIcon}>
        <View style={styles.searchStyle}>
          <SearchBar
            placeholder="Search for AudioBook.."
            onChangeText={(val) => {updateSearch(val)}}
            onSubmitEditing={()=> setUserInputEntered(search)}
            value={search}
            inputContainerStyle={{ marginRight: -7 }}
          />
        </View>
        <MaterialIconCommunity
          name="cog"
          size={45}
          color="white"
          style={styles.settingsIcon}
          onPress={toggleOverlay}
        />
        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          fullScreen={false}
        >
          <View style={styles.checkboxRow}>
            <Text>Audiobooks requested per search: {requestAudiobookAmount}.</Text>
          </View>

            <Slider
              value={requestAudiobookAmount}
              maximumValue={1000}
              minimumValue={1}
              onSlidingComplete={apiFunction}
              step={1}
    trackStyle={{ height: 10, width:windowWidth -50, backgroundColor: "transparent" }}
              thumbStyle={{
                height: 12,
                width: 12,
                backgroundColor: "black",
              }}
            />
        </Overlay>
      </View>
      <View style={styles.scrollStyle}>
        <AudioBooks
          searchBarInput={userInputEntered}
          requestAudiobookAmount={requestAudiobookAmount}
          authorLastName={authorLastName}
        />
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
    display: "flex",
    flexDirection: "row",
    width: windowWidth - 20,
    top: 20,
    backgroundColor: "rgb(57, 62, 66)",
  },
  searchStyle: {
    width: windowWidth - 80,
    top: -1,
    backgroundColor: "darkgreen",
  },
  settingsIcon: {
    backgroundColor: "red",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 3,
    borderWidth: 1,
  },
  checkboxRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
