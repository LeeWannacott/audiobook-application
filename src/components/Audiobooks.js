import {
  FlatList,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
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
  // console.log(props.searchBarInput)

  useEffect(() => {
    // console.log(props.searchBarInput);
  }, [props.searchBarInput]);

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

  useEffect(() => {
    // if (!loadingAudioBooks) {
      if (data.books != null || data.books != undefined) {
        const dataKeys = Object.entries(data.books);
        var bookCoverImagePath;
        dataKeys.forEach(([key, value]) => {
          // console.log(key, value.url_zip_file);
          bookCoverImagePath = value.url_zip_file;
          bookCoverImagePath = bookCoverImagePath.split("/");
          bookCoverImagePath =
            bookCoverImagePath[bookCoverImagePath.length - 2];
          bookCoverImagePath = `https://archive.org/services/get-item-image.php?identifier=${bookCoverImagePath}`;
          console.log(bookCoverImagePath)
          bookCoverURL.push(bookCoverImagePath);
        });
      // }
    }
  });

  const navigation = useNavigation();
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <ListItem topDivider>
      <Avatar
    source={{ uri: bookCoverURL[index]}}
        style={{ width: 150, height: 150 }}
    
        onPress={() =>
          navigation.navigate("Audio", [
            item.url_rss,
            item.id,
            bookCoverURL[index],
          ])
        }
      />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>
          Author: {item.authors[0].first_name} {item.authors[0].last_name},
          Lived: {item.authors[0].dob} - {item.authors[0].dod}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
      <Button
        onPress={() =>
          navigation.navigate("Audio", [
            item.url_rss,
            item.id,
            bookCoverURL[index],
          ])
        }
        title="Listen"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </ListItem>
  );

  if (!loadingAudioBooks) {
    // console.log(data.books[1].url_zip_file)
    return (
      <View>
        <View></View>
        <FlatList
          data={data.books}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
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

export default Audiobooks;
