import React, { useState } from "react";
import { SearchBar, Overlay, Slider } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { Switch, View, Dimensions, Text } from "react-native";
import { StyleSheet } from "react-native";
import ButtonPanel from "../components/ButtonPanel";
// import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authorsListJson from "../resources/audiobookAuthorsList.json";
import {genreList} from "../resources/audiobookGenreList.js";
// let authorsListJson = require("../resources/audiobookAuthorsList.json");

function Search() {
  const [search, updateSearch] = useState("");
  const [userInputEntered, setUserInputEntered] = useState("");
  const [requestAudiobookAmount, setRequestAudiobookAmount] = useState(26);

  const [visible, setVisible] = useState(false);

  // const [searchByTitleOrAuthorOrGenre, setSearchByTitleOrAuthorOrGenre] =
  // useState("title");
  const [enableGenreSelection, setEnableGenreSelection] = useState(false);
  const [enableAuthorSelection, setEnableAuthorSelection] = useState(false);
  const [apiSettingsHaveBeenSet, setApiSettingsHaveBeenSet] = useState(false);

  const [apiSettings, setApiSettings] = useState({
    searchBy: "title",
    audiobookGenre: "*Non-fiction",
    authorLastName: "Hoffmann",
    audiobookAmountRequested: 26,
  });

  console.log("explore render");

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  React.useState(() => {
    try {
      getData("apiSettings5").then((apiSettingsFromStorage) => {
        console.log("get api settings from storage");
        apiSettingsFromStorage
          ? setApiSettings({
              ["searchBy"]: apiSettingsFromStorage["searchBy"],
              ["audiobookGenre"]: apiSettingsFromStorage["audiobookGenre"],
              ["authorLastName"]: apiSettingsFromStorage["authorLastName"],
              ["audiobookAmountRequested"]:
                apiSettingsFromStorage["audiobookAmountRequested"],
            })
          : null;
      });
      setApiSettingsHaveBeenSet(true);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const storeAsyncData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const storeApiSettings = (title, genre, author, amount) => {
    const tempApiSettings = {
      searchBy: title,
      audiobookGenre: genre,
      authorLastName: author,
      audiobookAmountRequested: amount,
    };
    console.log(tempApiSettings);
    storeAsyncData("apiSettings5", tempApiSettings);
  };

  // getData("authorAndGenreSelectedBooleans").then((enablePickers) => {
  // enablePickers != null
  // ? (setEnableAuthorSelection(enablePickers[0]),
  // setEnableGenreSelection(enablePickers[1]))
  // : null;
  // });

  const storeAuthorGenreEnablePickers = (
    authorSelectedBool,
    genreSelectedBool
  ) => {
    storeAsyncData("authorAndGenreSelectedBooleans", [
      authorSelectedBool,
      genreSelectedBool,
    ]);
  };

  function changeAudiobookAmountRequested(amount) {
    storeApiSettings(
      apiSettings["searchBy"],
      apiSettings["audiobookGenre"],
      apiSettings["authorLastName"],
      amount
    );
    setApiSettings((prevState) => ({
      ...prevState,
      ["audiobookAmountRequested"]: amount,
    }));
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const genreListRender = genreList.map((genre, i) => {
    return (
      <Picker.Item
        key={`${genre}`}
        label={`${genre}`}
        value={`${genre}`}
      />
    );
  });
  console.log(genreListRender);

  const authorsListRender = authorsListJson["authors"].map((author, i) => {
    return (
      <Picker.Item
        key={`${authorsListJson["authors"][i].first_name} ${authorsListJson["authors"][i].last_name}`}
        label={`${authorsListJson["authors"][i].first_name} ${authorsListJson["authors"][i].last_name}`}
        value={`${authorsListJson["authors"][i].last_name}`}
      />
    );
  });

  return (
    <View>
      <View style={styles.searchBarAndSettingsIcon}>
        <View style={styles.searchStyle}>
          <SearchBar
            placeholder={`Search by ${apiSettings["searchBy"]}...`}
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
            <Text>{`Searching by:`}</Text>
          </View>
          <Picker
            selectedValue={apiSettings["searchBy"]}
            onValueChange={(titleOrGenreOrAuthor, itemIndex) => {
              console.log(titleOrGenreOrAuthor, itemIndex);
              setApiSettings((prevState) => ({
                ...prevState,
                ["searchBy"]: titleOrGenreOrAuthor,
              }));
              storeApiSettings(
                titleOrGenreOrAuthor,
                apiSettings["audiobookGenre"],
                apiSettings["authorLastName"],
                apiSettings["audiobookAmountRequested"]
              );
              switch (titleOrGenreOrAuthor) {
                case "title":
                  setEnableAuthorSelection(false);
                  setEnableGenreSelection(false);
                  storeAuthorGenreEnablePickers(false, false);
                  break;
                case "genre":
                  setEnableAuthorSelection(false);
                  setEnableGenreSelection(true);
                  storeAuthorGenreEnablePickers(false, true);
                  break;
                case "author":
                  setEnableAuthorSelection(true);
                  setEnableGenreSelection(false);
                  storeAuthorGenreEnablePickers(true, false);
                  break;
              }
            }}
          >
            <Picker.Item label="Title" value="title" />
            <Picker.Item label="Author" value="author" />
            <Picker.Item label="Genre" value="genre" />
          </Picker>
          <View style={styles.titleOrAuthorStringFlexbox}>
            <Text>{`Select Author:`}</Text>
          </View>

          <Picker
            selectedValue={apiSettings["authorLastName"]}
            enabled={enableAuthorSelection}
            onValueChange={(author, itemIndex) => {
              setApiSettings((prevState) => ({
                ...prevState,
                ["authorLastName"]: author,
              }));
              storeApiSettings(
                apiSettings["searchBy"],
                apiSettings["audiobookGenre"],
                author,
                apiSettings["audiobookAmountRequested"]
              );
            }}
          >
            {authorsListRender}
          </Picker>

          <View style={styles.titleOrAuthorStringFlexbox}>
            <Text>{`Select Genre:`}</Text>
          </View>

          <Picker
            selectedValue={apiSettings["audiobookGenre"]}
            enabled={enableGenreSelection}
            onValueChange={(genre, itemIndex) => {
              setApiSettings((prevState) => ({
                ...prevState,
                ["audiobookGenre"]: genre,
              }));
              storeApiSettings(
                apiSettings["searchBy"],
                genre,
                apiSettings["authorLastname"],
                apiSettings["audiobookAmountRequested"]
              );
            }}
          >
            {genreListRender}
          </Picker>
          <View style={styles.checkboxRow}>
            <Text>
              Audiobooks requested per search:{" "}
              {apiSettings["audiobookAmountRequested"]}.
            </Text>
          </View>

          <Slider
            value={apiSettings["audiobookAmountRequested"]}
            maximumValue={420}
            minimumValue={1}
            onSlidingComplete={changeAudiobookAmountRequested}
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
          apiSettings={apiSettings}
          searchBarInputSubmitted={userInputEntered}
          searchBarCurrentText={search}
          requestAudiobookAmount={requestAudiobookAmount}
          apiSettingsHaveBeenSet={apiSettingsHaveBeenSet}
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
    bottom: 5,
  },
  titleOrAuthorStringFlexbox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  scrollStyle: {
    top: 20,
    height: 600,
    backgroundColor: "#331800",
  },
});
