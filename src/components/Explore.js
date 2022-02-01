import React, { useState } from "react";
import { SearchBar, Overlay, CheckBox, Slider } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { Switch, View, Dimensions, Text, useRef } from "react-native";
import { StyleSheet } from "react-native";
import ButtonPanel from "../components/ButtonPanel";
// import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Search() {
  const [search, updateSearch] = useState("");
  const [userInputEntered, setUserInputEntered] = useState("");
  const [requestAudiobookAmount, setRequestAudiobookAmount] = useState(26);
  // const [search, setRequestAudiobookAmount] = useState("*")

  const [visible, setVisible] = useState(false);

  const [searchByAuthor, setSearchByAuthor] = useState(false);
  const [titleOrAuthorStringForToggle, setTitleOrAuthorStringForToggle] =
    useState("Title");
  const [titleOrAuthorStringForSearchbar, setTitleOrAuthorStringForSearchbar] =
    useState("Title");

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  getData("searchByAuthor").then((jsonValue) => {
    console.log(jsonValue);
    jsonValue != null
      ? (setSearchByAuthor(jsonValue[0]),
        setTitleOrAuthorStringForToggle(jsonValue[1]),
        setTitleOrAuthorStringForSearchbar(jsonValue[2]))
      : console.log("error");
  });

  const storeAsyncData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const toggleSwitch = () => {
    setSearchByAuthor((previousState) => !previousState);
  };

  const displayTitleOrAuthorString = () => {
    return !searchByAuthor
      ? (setTitleOrAuthorStringForToggle("Authors Last Name."),
        setTitleOrAuthorStringForSearchbar("Author"),
        storeAsyncData("searchByAuthor", [
          !searchByAuthor,
          "Authors Last Name.",
          "Author",
        ]))
      : (setTitleOrAuthorStringForToggle("Audiobooks Title."),
        setTitleOrAuthorStringForSearchbar("Title"),
        storeAsyncData("searchByAuthor", [
          !searchByAuthor,
          "Audiobooks Title.",
          "Title",
        ]));
  };


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
            placeholder={`Search by ${titleOrAuthorStringForSearchbar}...`}
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
              thumbColor={searchByAuthor ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => {
                toggleSwitch(value);
                displayTitleOrAuthorString();
              }}
              value={searchByAuthor}
            />
            <Text>{`Search by: ${titleOrAuthorStringForToggle}`}</Text>
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
          searchByAuthor={searchByAuthor}
        />
      </View>
      <View style={styles.buttonStyle}>
        <ButtonPanel buttonPressedIndex={0} />
      </View>
    </View>
  );
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
    backgroundColor: "rgb(48, 54, 61)",
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
