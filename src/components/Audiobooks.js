import {
  FlatList,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Card,
} from "react-native";
import { ListItem, Image, Avatar } from "react-native-elements";
import AudiobookCard from "./AudiobookCard";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
// import Search from "../components/SearchBar";

function Audiobooks(props) {
  const [loadingAudioBooks, setLoadingAudioBooks] = useState(true);
  const [data, setData] = useState([]);
  // const [imageData, setImageData] = useState([]);

  const bookCoverURL = [];
  useEffect(() => {
    // setLoadingAudioBooks(true)
    let searchQuery = props.searchBarInput;
    searchQuery = searchQuery.replace(/\s/g, "%20");
    fetch(
      `https://librivox.org/api/feed/audiobooks/?&title=^${searchQuery}&extended=1&format=json`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .then(() => {})
      .catch((error) => console.error(error))
      .finally(() => {
        setLoadingAudioBooks(false);
      });
  }, [props.searchBarInput]);

  // console.log(data)

  useEffect(() => {
    // if (!loadingAudioBooks) {
    if (data.books != null || data.books != undefined) {
      const dataKeys = Object.entries(data.books);
      var bookCoverImagePath;
      dataKeys.forEach(([key, value]) => {
        // console.log(key, value.url_zip_file);
        bookCoverImagePath = value.url_zip_file;
        bookCoverImagePath = bookCoverImagePath.split("/");
        bookCoverImagePath = bookCoverImagePath[bookCoverImagePath.length - 2];
        bookCoverImagePath = `https://archive.org/services/get-item-image.php?identifier=${bookCoverImagePath}`;
        // console.log(bookCoverImagePath);
        bookCoverURL.push(bookCoverImagePath);
      });
      // }
    }
  });

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <ListItem topDivider style={styles.AudioBookListView}>
      <View style={styles.ImageContainer}>
        {/*<ListItem.Title>{item.title}</ListItem.Title>*/}
        <Avatar
          source={{ uri: bookCoverURL[index] }}
          style={{ width: windowWidth / 2 - 42, height: windowHeight / 5 }}
          onPress={() =>
            navigation.navigate("Audio", [
              item.url_rss,
              item.id,
              bookCoverURL[index],
            ])
          }
        />
        {/*<ListItem.Subtitle>
          By: {item.authors[0].first_name} {item.authors[0].last_name}
        </ListItem.Subtitle>*/}
      </View>
    </ListItem>
  );

  if (!loadingAudioBooks) {
    // console.log(data.books[1].url_zip_file)
    console.log(data.books);
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
      <View>
        <View></View>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "red",
    width: windowWidth / 2 - 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
  },
  AudioBookListView: {
    flexDirection: "row",
    backgroundColor: "green",
  },
});

export default Audiobooks;
