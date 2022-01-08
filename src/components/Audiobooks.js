import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";

import * as SQLite from "expo-sqlite";
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

  React.useEffect(() => {
    createHistoryTableDB(db);
  }, []);

  const addAudiobookToHistory  = (
    audiobook_rss_url,
    audiobook_id,
    audiobook_image
  ) => {
    addAudiobookToHistoryDB(db, audiobook_rss_url, audiobook_id, audiobook_image);
  };

  const bookCoverURL = [];
  useEffect(() => {
    let searchQuery = props.searchBarInput;
    searchQuery = searchQuery.replace(/\s/g, "%20");
    const amountOfAudiobooks = props.requestAudiobookAmount
    fetch(
      `https://librivox.org/api/feed/audiobooks/?&title=^${searchQuery}&extended=1&format=json&limit=${amountOfAudiobooks}`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {
        setLoadingAudioBooks(false);
      });
  }, [props.searchBarInput]);

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
    <ListItem topDivider style={styles.AudioBookListView}>
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
            ]);
          }}
        />
      </View>
    </ListItem>
  );

  if (!loadingAudioBooks) {
    return (
      <View>
        <View></View>
        <FlatList
          data={data.books}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          backgroundColor="black"
        />
      </View>
    );
  } else {
    return (
      <View style={styles.ActivityIndicatorStyle}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "red",
    width: windowWidth / 2 - 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2,
    color: "green",
  },
  AudioBookListView: {
    flexDirection: "row",
    backgroundColor: "green",
  },
});
