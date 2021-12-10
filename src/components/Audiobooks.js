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
import {openDatabase} from "../utils"

const db = openDatabase();

export default function Audiobooks(props) {
  const [loadingAudioBooks, setLoadingAudioBooks] = useState(true);
  const [data, setData] = useState([]);
  const [bookCovers, setBookCovers] = useState([]);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists test13 (id integer primary key not null, audiobook_rss_url text not null unique, audiobook_id text not null unique, audiobook_image text);"
      );
    });
  }, []);

  const add = (audiobook_rss_url, audiobook_id, audiobook_image) => {
    // is text empty?
    if (audiobook_rss_url === null || audiobook_rss_url === "") {
      return false;
    }

    if (audiobook_id === null || audiobook_id === "") {
      return false;
    }

    if (audiobook_image === null || audiobook_image === "") {
      return false;
    }

      db.transaction(
        (tx) => {
          tx.executeSql(
            "insert into test13 (audiobook_rss_url, audiobook_id, audiobook_image) values (?,?,?)",
            [audiobook_rss_url, audiobook_id, audiobook_image]
          );
          // tx.executeSql("select * from test3", [], (_, { rows }) =>
            // console.log(JSON.stringify(rows))
          // );
        },
        null,
        forceUpdate
      );
  };

  const bookCoverURL = [];
  useEffect(() => {
    let searchQuery = props.searchBarInput;
    searchQuery = searchQuery.replace(/\s/g, "%20");
    fetch(
      `https://librivox.org/api/feed/audiobooks/?&title=^${searchQuery}&extended=1&format=json`
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
            add(item.url_rss, item.id, bookCovers[index]);
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

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

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
    top: 20,
  },
  AudioBookListView: {
    flexDirection: "row",
    backgroundColor: "green",
  },
});
