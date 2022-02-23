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
import AudiobookAccordionList from "../components/audiobookAccordionList.js";

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

  const addAudiobookToHistory = (
    audiobook_rss_url,
    audiobook_id,
    audiobook_image,
    audiobook_title,
    audiobook_author_first_name,
    audiobook_author_last_name,
    audiobook_total_time,
    audiobook_copyright_year,
    audiobook_genres
  ) => {
    audiobook_genres = JSON.stringify(audiobook_genres);
    addAudiobookToHistoryDB(
      db,
      audiobook_rss_url,
      audiobook_id,
      audiobook_image,
      audiobook_title,
      audiobook_author_first_name,
      audiobook_author_last_name,
      audiobook_total_time,
      audiobook_copyright_year,
      audiobook_genres
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
    <View>
      <ListItem
        topDivider
        containerStyle={styles.AudioBookListView}
        key={item.id}
      >
        <View style={styles.ImageContainer}>
          <Avatar
            source={{ uri: bookCovers[index] }}
            style={{ width: windowWidth / 2 - 42, height: windowHeight / 5 }}
            onPress={() => {
              addAudiobookToHistory(
                item.url_rss,
                item.id,
                bookCovers[index],
                item.title,
                item.authors[0]["first_name"],
                item.authors[0]["last_name"],
                item.totaltime,
                item.copyright_year,
                item.genres
              );
              navigation.navigate("Audio", [
                item.url_rss,
                item.id,
                bookCovers[index],
                item.num_sections,
                item.url_text_source,
                item.url_zip_file,
                item.title,
                item.authors[0]["first_name"],
                item.authors[0]["last_name"],
                item.totaltime,
                item.copyright_year,
                item.genres,
              ]);
            }}
          />
          <View></View>
        </View>
      </ListItem>
      <AudiobookAccordionList
        audiobookTitle={item.title}
        audiobookAuthorFirstName={item.authors[0]["first_name"]}
        audiobookAuthorLastName={item.authors[0]["last_name"]}
        audiobookTotalTime={item.totaltime}
        audiobookCopyrightYear={item.copyright_year}
        audiobookGenres={JSON.stringify(item.genres)}
      />
    </View>
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
  accordionStyle: {
    flex: 1,
    color: "white",
    backgroundColor: "#331800",
    width: windowWidth / 2 - 8,
    justifyContent: "center",
    height: 50,
  },
  accordionTitleStyle: {
    color: "black",
    backgroundColor: "#331800",
    width: windowWidth / 2 - 8,
    flex: 1,
    height: 40,
  },
  accordianItemsStyle: {
    color: "white",
    backgroundColor: "#51361a",
    width: windowWidth / 2 - 15,
  },
});
