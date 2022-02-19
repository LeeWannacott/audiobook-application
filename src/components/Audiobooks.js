import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

import { openDatabase } from "../utils";
import {
  createHistoryTableDB,
  addAudiobookToHistoryDB,
} from "../database_functions";

const db = openDatabase();

export default function Audiobooks(props) {
  const [loadingAudioBooks, setLoadingAudioBooks] = useState(true);
  const [data, setData] = useState([]);
  const [bookCovers, setBookCovers] = useState([]);
  const [queryTitleOrAuthor, setQueryTitleOrAuthor] = useState([]);
  const [isAccordianExpand, setIsAccordianExpand] = useState(false);

  React.useEffect(() => {
    createHistoryTableDB(db);
  }, []);

  const addAudiobookToHistory = (
    audiobook_rss_url,
    audiobook_id,
    audiobook_image
  ) => {
    addAudiobookToHistoryDB(
      db,
      audiobook_rss_url,
      audiobook_id,
      audiobook_image
    );
  };

  const bookCoverURL = [];
  useEffect(() => {
    setLoadingAudioBooks(true);
    const searchQuery = encodeURIComponent(props.searchBarCurrentText);
    const genre = encodeURIComponent(props.apiSettings["audiobookGenre"]);
    const author = encodeURIComponent(props.apiSettings["authorLastName"]);
    const amountOfAudiobooks = encodeURIComponent(
      props.apiSettings["audiobookAmountRequested"]
    );
    const carot = "^";

    let apiFetchQuery;
    switch (props.apiSettings["searchBy"]) {
      case "title":
        apiFetchQuery = `https://librivox.org/api/feed/audiobooks/?title=${carot}${searchQuery}&extended=1&format=json&limit=${amountOfAudiobooks}`;
        break;
      case "author":
        apiFetchQuery = `https://librivox.org/api/feed/audiobooks/?author=${author}&extended=1&format=json&limit=${amountOfAudiobooks}`;
        break;
      case "genre":
        apiFetchQuery = `https://librivox.org/api/feed/audiobooks/?genre=${genre}&extended=1&format=json&limit=${amountOfAudiobooks}`;
        break;
      default:
        break;
    }
    if (props.apiSettings["searchBy"]) {
      fetch(apiFetchQuery)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => {
          setLoadingAudioBooks(false);
        });
    }
  }, [
    props.apiSettings,
    props.searchBarInputSubmitted,
    props.apiSettingsHaveBeenSet,
  ]);

  useEffect(() => {
    // console.log(data.books);
    if (data.books != null || data.books != undefined) {
      const dataKeys = Object.values(data.books);
      var bookCoverImagePath;
      dataKeys.forEach((bookCoverURLPath) => {
        bookCoverImagePath = bookCoverURLPath.url_zip_file.split("/");
        bookCoverImagePath = bookCoverImagePath[bookCoverImagePath.length - 2];
        bookCoverImagePath = `https://archive.org/services/get-item-image.php?identifier=${bookCoverImagePath}`;
        bookCoverURL.push(bookCoverImagePath);
      });
      setBookCovers(bookCoverURL);
    }
  }, [data.books]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <ListItem topDivider containerStyle={styles.AudioBookListView}>
      <View style={styles.ImageContainer}>
        <Avatar
          source={{ uri: bookCovers[index] }}
          style={{ width: windowWidth / 2 - 42, height: windowHeight / 5 }}
          onPress={() => {
            addAudiobookToHistory(item.url_rss, item.id, bookCovers[index]);
            navigation.navigate("Audio", [
              item.url_rss,
              item.id,
              bookCovers[index],
              item.num_sections,
              item.url_text_source,
              item.url_zip_file,
            ]);
          }}
        />
        <ListItem.Accordion
          content={
            <>
              <Icon name="info" size={20} />

              <ListItem.Content>
                <ListItem.Title> Info</ListItem.Title>
              </ListItem.Content>
            </>
          }
          key={item.id}
          isExpanded={isAccordianExpand}
          onPress={() => {
            setIsAccordianExpand(!isAccordianExpand);
          }}
        >
          <ListItem.Subtitle>
            <MaterialIconCommunity
              name="format-title"
              size={15}
            ></MaterialIconCommunity>
            {": "}
            {item.title}
          </ListItem.Subtitle>
          <ListItem.Subtitle>
            <MaterialIconCommunity
              name="feather"
              size={15}
            ></MaterialIconCommunity>
            {": "}
            {item.authors[0]["first_name"]} {item.authors[0]["last_name"]}
          </ListItem.Subtitle>
          <ListItem.Subtitle>
            <MaterialIconCommunity
              name="alpha-g-circle"
              size={15}
            ></MaterialIconCommunity>
            {": "}
            {item.genres[0].name}
          </ListItem.Subtitle>
        </ListItem.Accordion>
      </View>
    </ListItem>
  );

  if (!loadingAudioBooks) {
    return (
      <View style={styles.audiobookContainer}>
        <FlatList
          data={data.books}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
        />
      </View>
    );
  } else {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#00ff00"
          style={styles.ActivityIndicatorStyle}
        />
      </View>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    width: windowWidth / 2 - 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
  },
  audiobookContainer: {
    paddingBottom: 15,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 2,
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2 - 90,
    color: "green",
  },
  AudioBookListView: {
    backgroundColor: "#51361a",
  },
});
