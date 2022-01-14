import React, { useState } from "react";
import { SearchBar, Overlay, CheckBox, Slider } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { Switch, View, Dimensions, Text } from "react-native";
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
  const [searchByTitleOrAuthor, setSearchByTitleOrAuthor] = useState(false);
  const toggleSwitch = () =>
    setSearchByTitleOrAuthor((previousState) => !previousState);
  const [titleOrAuthorString, setTitleOrAuthorString] = useState("Title");
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
            onChangeText={(val) => {
              updateSearch(val);
            }}
            onSubmitEditing={() => setUserInputEntered(search)}
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
          <View style={styles.titleOrAuthorStringFlexbox}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={searchByTitleOrAuthor ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => {
                toggleSwitch(value),
                  searchByTitleOrAuthor
                    ? setTitleOrAuthorString("Title")
                    : setTitleOrAuthorString("Authors last name.");
              }}
              value={searchByTitleOrAuthor}
            />
            <Text>{`Search by: ${titleOrAuthorString}`}</Text>
          </View>
          <View style={styles.checkboxRow}>
            <Text>
              Audiobooks requested per search: {requestAudiobookAmount}.
            </Text>
          </View>

          <Slider
            value={requestAudiobookAmount}
            maximumValue={1000}
            minimumValue={1}
            onSlidingComplete={apiFunction}
            step={1}
            trackStyle={{
              height: 10,
              width: windowWidth - 50,
              backgroundColor: "transparent",
            }}
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
          searchBarInputSubmitted={userInputEntered}
          searchBarCurrentText={search}
          requestAudiobookAmount={requestAudiobookAmount}
          authorLastName={authorLastName}
          searchByTitleOrAuthor={searchByTitleOrAuthor}
          
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
  titleOrAuthorStringFlexbox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  scrollStyle: {
    top: 20,
    height: 600,
    backgroundColor: "black",
  },
});
