import React, { useState, useRef } from "react";
import { SearchBar, Overlay, Slider } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { View, Dimensions, Text } from "react-native";
import { StyleSheet } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import { Picker } from "@react-native-picker/picker";
import authorsListJson from "../resources/audiobookAuthorsList.json";
import { genreList } from "../resources/audiobookGenreList.js";
// let authorsListJson = require("../resources/audiobookAuthorsList.json");
import { getAsyncData, storeAsyncData } from "../database_functions";

import { Button } from "react-native-paper";

function Search() {
  const [search, updateSearch] = useState("");
  const [userInputEntered, setUserInputEntered] = useState("");
  const [requestAudiobookAmount, setRequestAudiobookAmount] = useState(26);

  const [visible, setVisible] = useState(false);
  const [enableGenreSelection, setEnableGenreSelection] = useState(false);
  const [enableAuthorSelection, setEnableAuthorSelection] = useState(false);
  const [isSearchBarDisabled, setIsSearchBarDisabled] = useState(false);
  const refToSearchbar = useRef(null);

  const [apiSettings, setApiSettings] = useState({
    searchBy: "",
    audiobookGenre: "",
    authorLastName: "",
    audiobookAmountRequested: 0,
  });

  React.useState(() => {
    try {
      getAsyncData("apiSettings").then((apiSettingsFromStorage) => {
        apiSettingsFromStorage
          ? setApiSettings(apiSettingsFromStorage)
          : setApiSettings({
              ["searchBy"]: "title",
              ["audiobookGenre"]: "*Non-fiction",
              ["authorLastName"]: "Hoffmann",
              ["audiobookAmountRequested"]: 26,
            });
      });
      getAsyncData("author&GenrePickerSearchbarDisableBools").then(
        (authorGenreSearchbar) => {
          authorGenreSearchbar
            ? (setEnableAuthorSelection(authorGenreSearchbar[0]),
              setEnableGenreSelection(authorGenreSearchbar[1]),
              setIsSearchBarDisabled(authorGenreSearchbar[2]))
            : null;
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const storeApiSettings = (tempApiSettings) => {
    storeAsyncData("apiSettings", tempApiSettings);
  };

  const storeAuthorGenreEnablePickers = (dropdownPickers) => {
    storeAsyncData("author&GenrePickerSearchbarDisableBools", [
      dropdownPickers.authorSelected,
      dropdownPickers.genreSelected,
      dropdownPickers.isSearchDisabled,
    ]);
  };

  function changeAudiobookAmountRequested(amount) {
    storeApiSettings({
      ...apiSettings,
      ["audiobookAmountRequested"]: amount,
    });
    setApiSettings((prevState) => ({
      ...prevState,
      ["audiobookAmountRequested"]: amount,
    }));
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const genreListRender = React.useCallback(
    genreList.map((genre) => {
      return (
        <Picker.Item key={`${genre}`} label={`${genre}`} value={`${genre}`} />
      );
    }),
    [genreList]
  );

  const AuthorsListRender = React.useCallback(
    authorsListJson["authors"].map((author, i) => {
      return (
        <Picker.Item
          key={`${authorsListJson["authors"][i].id}`}
          label={`${authorsListJson["authors"][i].first_name} ${authorsListJson["authors"][i].last_name}`}
          value={`${authorsListJson["authors"][i].last_name}`}
        />
      );
    }),
    [authorsListJson]
  );

  function searchBarPlaceholder() {
    switch (apiSettings["searchBy"]) {
      case "title":
        return "Search by title: ";
      case "author":
        return `Author: ${apiSettings["authorLastName"]}`;
      case "genre":
        return `Genre: ${apiSettings["audiobookGenre"]}`;
    }
  }

  return (
    <View>
      <View style={styles.searchBarAndSettingsIcon}>
        <View style={styles.searchStyle}>
          <SearchBar
            ref={(searchbar) => (refToSearchbar.current = searchbar)}
            placeholder={searchBarPlaceholder()}
            disabled={isSearchBarDisabled}
            onChangeText={(val) => {
              updateSearch(val);
            }}
            onSubmitEditing={() => setUserInputEntered(search)}
            value={search}
            inputContainerStyle={{ backgroundColor: "white", height: 55 }}
            inputStyle={{ backgroundColor: "white", height: 55 }}
            containerStyle={{ backgroundColor: "black", height: 70 }}
          />
        </View>
        <Button
          onPress={toggleOverlay}
          mode="contained"
          style={{ backgroundColor: "black" }}
          style={styles.settingsIcon}
        >
          <MaterialIconCommunity name="cog" size={45} color="white" />
        </Button>
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
              setApiSettings((prevState) => ({
                ...prevState,
                ["searchBy"]: titleOrGenreOrAuthor,
              }));
              storeApiSettings({
                ...apiSettings,
                ["searchBy"]: titleOrGenreOrAuthor,
              });
              switch (titleOrGenreOrAuthor) {
                case "title":
                  setEnableAuthorSelection(false);
                  setEnableGenreSelection(false);
                  setIsSearchBarDisabled(false);

                  storeAuthorGenreEnablePickers({
                    authorSelected: false,
                    genreSelected: false,
                    isSearchDisabled: false,
                  });
                  break;
                case "genre":
                  refToSearchbar.current.clear();
                  setEnableAuthorSelection(false);
                  setEnableGenreSelection(true);
                  setIsSearchBarDisabled(true);
                  storeAuthorGenreEnablePickers({
                    authorSelected: false,
                    genreSelected: true,
                    isSearchDisabled: true,
                  });
                  break;
                case "author":
                  refToSearchbar.current.clear();
                  setEnableAuthorSelection(true);
                  setEnableGenreSelection(false);
                  setIsSearchBarDisabled(true);
                  storeAuthorGenreEnablePickers({
                    authorSelected: true,
                    genreSelected: false,
                    isSearchDisabled: true,
                  });
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
            prompt={"Search by author:"}
            // mode={"dropdown"}
            enabled={enableAuthorSelection}
            onValueChange={(author, itemIndex) => {
              setApiSettings((prevState) => ({
                ...prevState,
                ["authorLastName"]: author,
              }));
              storeApiSettings({
                ...apiSettings,
                ["authorLastName"]: author,
              });
            }}
          >
            {AuthorsListRender}
          </Picker>

          <View style={styles.titleOrAuthorStringFlexbox}>
            <Text>{`Select Genre:`}</Text>
          </View>

          <Picker
            selectedValue={apiSettings["audiobookGenre"]}
            prompt={"Search by genre:"}
            enabled={enableGenreSelection}
            onValueChange={(genre, itemIndex) => {
              setApiSettings((prevState) => ({
                ...prevState,
                ["audiobookGenre"]: genre,
              }));
              storeApiSettings({
                ...apiSettings,
                ["audiobookGenre"]: genre,
              });
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
            onValueChange={changeAudiobookAmountRequested}
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
        />
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
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: "black",
  },
  searchStyle: {
    width: windowWidth - 100,
    top: -1,
    backgroundColor: "darkgreen",
  },
  settingsIcon: {
    backgroundColor: "black",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    borderWidth: 1,
    borderRadius: 2,
  },
  checkboxRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
