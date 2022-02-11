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
          :  null;
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

  const authorsListRender = authorsListJson["authors"].map((author, i) => {
    return (
      <Picker.Item
        key={`${i}: ${authorsListJson["authors"][i].first_name}`}
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
            <Picker.Item label="Any" value="" />
            <Picker.Item label="*Non-fiction" value="*Non-fiction" />
            <Picker.Item
              label="Action & Adventure"
              value="Action & Adventure"
            />
            <Picker.Item label="Ancient" value="Ancient" />
            <Picker.Item label="Animals & Nature" value="Animals & Nature" />
            <Picker.Item label="Anthologies" value="Anthologies" />
            <Picker.Item label="Antiquity" value="Antiquity" />
            <Picker.Item label="Asian Antiquity" value="Asian Antiquity" />
            <Picker.Item
              label="Atheism & Agnosticism"
              value="Atheism & Agnosticism"
            />
            <Picker.Item label="Ballads" value="Ballads" />
            <Picker.Item label="Bibles" value="Bibles" />
            <Picker.Item
              label="Biography & Autobiography"
              value="Biography & Autobiography"
            />
            <Picker.Item
              label="Business & Economics"
              value="Business & Economics"
            />
            <Picker.Item label="Chemistry" value="Chemistry" />
            <Picker.Item
              label="Children's Fiction"
              value="Children's Fiction"
            />
            <Picker.Item
              label="Children's Non-fiction"
              value="Children's Non-fiction"
            />
            <Picker.Item label="Christian Fiction" value="Christian Fiction" />
            <Picker.Item
              label="Christianity - Biographies"
              value="Christianity - Biographies"
            />
            <Picker.Item
              label="Christianity - Commentary"
              value="Christianity - Commentary"
            />
            <Picker.Item
              label="Christianity - Other"
              value="Christianity - Other"
            />
            <Picker.Item label="Comedy" value="Comedy" />
            <Picker.Item label="Contemporary" value="Contemporary" />
            <Picker.Item label="Crafts & Hobbies" value="Crafts & Hobbies" />
            <Picker.Item
              label="Crime & Mystery Fiction"
              value="Crime & Mystery Fiction"
            />
            <Picker.Item label="Detective Fiction" value="Detective Fiction" />
            <Picker.Item label="Drama" value="Drama" />
            <Picker.Item label="Dramatic Readings" value="Dramatic Readings" />
            <Picker.Item label="Early Modern" value="Early Modern" />
            <Picker.Item label="Earth Sciences" value="Earth Sciences" />
            <Picker.Item label="Education" value="Education" />
            <Picker.Item label="Elegies & Odes" value="Elegies & Odes" />
            <Picker.Item label="Epics" value="Epics" />
            <Picker.Item
              label="Epistolary Fiction"
              value="Epistolary Fiction"
            />
            <Picker.Item label="Erotica" value="Erotica" />
            <Picker.Item
              label="Essays & Short Works"
              value="Essays & Short Works"
            />
            <Picker.Item label="Exploration" value="Exploration" />
            <Picker.Item
              label="Family & Relationships"
              value="Family & Relationships"
            />
            <Picker.Item label="Free Verse" value="Free Verse" />
            <Picker.Item label="Games" value="Games" />
            <Picker.Item label="Gardening" value="Gardening" />
            <Picker.Item label="General Fiction" value="General Fiction" />
            <Picker.Item label="Gothic Fiction" value="Gothic Fiction" />
            <Picker.Item label="Health & Fitness" value="Health & Fitness" />
            <Picker.Item label="Historical" value="Historical" />
            <Picker.Item
              label="Historical Fiction"
              value="Historical Fiction"
            />
            <Picker.Item label="History" value="History" />
            <Picker.Item label="House & Home" value="House & Home" />
            <Picker.Item label="Humor" value="Humor" />
            <Picker.Item label="Law" value="Law" />
            <Picker.Item label="Letters" value="Letters" />
            <Picker.Item label="Life Sciences" value="Life Sciences" />
            <Picker.Item
              label="Literary Collections"
              value="Literary Collections"
            />
            <Picker.Item
              label="Literary Criticism"
              value="Literary Criticism"
            />
            <Picker.Item label="Literary Fiction" value="Literary Fiction" />
            <Picker.Item label="Lyric" value="Lyric" />
            <Picker.Item label="Mathematics" value="Mathematics" />
            <Picker.Item label="Medical" value="Medical" />
            <Picker.Item label="Medieval" value="Medieval" />
            <Picker.Item label="Memoirs" value="Memoirs" />
            <Picker.Item
              label="Middle Ages/Middle History"
              value="Middle Ages/Middle History"
            />
            <Picker.Item label="Modern" value="Modern" />
            <Picker.Item label="Modern (19th C)" value="Modern (19th C)" />
            <Picker.Item label="Modern (20th C)" value="Modern (20th C)" />
            <Picker.Item label="Music" value="Music" />
            <Picker.Item label="Narratives" value="Narratives" />
            <Picker.Item label="Nature" value="Nature" />
            <Picker.Item
              label="Nautical & Marine Fiction"
              value="Nautical & Marine Fiction"
            />
            <Picker.Item label="Performing Arts" value="Performing Arts" />
            <Picker.Item label="Philosophy" value="Philosophy" />
            <Picker.Item label="Plays" value="Plays" />
            <Picker.Item label="Poetry" value="Poetry" />
            <Picker.Item label="Political Science" value="Political Science" />
            <Picker.Item label="Psychology" value="Psychology" />
            <Picker.Item
              label="Published 1800 -1900"
              value="Published 1800 -1900"
            />
            <Picker.Item
              label="Published 1900 onward"
              value="Published 1900 onward"
            />
            <Picker.Item
              label="Published before 1800"
              value="Published before 1800"
            />
            <Picker.Item label="Reference" value="Reference" />
            <Picker.Item label="Religion" value="Religion" />
            <Picker.Item label="Religious Fiction" value="Religious Fiction" />
            <Picker.Item label="Romance" value="Romance" />
            <Picker.Item label="Sagas" value="Sagas" />
            <Picker.Item label="Satire" value="Satire" />
            <Picker.Item label="School" value="School" />
            <Picker.Item label="Science" value="Science" />
            <Picker.Item label="Science Fiction" value="Science Fiction" />
            <Picker.Item label="Short Stories" value="Short Stories" />
            <Picker.Item label="Short non-fiction" value="Short non-fiction" />
            <Picker.Item label="Short works" value="Short works" />
            <Picker.Item
              label="Single Author Collections"
              value="Single Author Collections"
            />
            <Picker.Item label="Sonnets" value="Sonnets" />
            <Picker.Item
              label="Sports & Recreation"
              value="Sports & Recreation"
            />
            <Picker.Item label="Sports Fiction" value="Sports Fiction" />
            <Picker.Item
              label="Technology & Engineering"
              value="Technology & Engineering"
            />
            <Picker.Item label="Tragedy" value="Tragedy" />
            <Picker.Item label="Transportation" value="Transportation" />
            <Picker.Item
              label="Travel & Geography"
              value="Travel & Geography"
            />
            <Picker.Item label="Travel Fiction" value="Travel Fiction" />
            <Picker.Item label="True Crime" value="True Crime" />
            <Picker.Item label="War & Military" value="War & Military" />
            <Picker.Item
              label="War & Military Fiction"
              value="War & Military Fiction"
            />
            <Picker.Item
              label="Writing & Linguistics"
              value="Writing & Linguistics"
            />
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
