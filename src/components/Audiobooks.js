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
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from "react";
  
function Audiobooks() {
  const [loadingAudioBooks, setLoadingAudioBooks] = useState(true);
  const [data, setData] = useState([]);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    fetch("https://librivox.org/api/feed/audiobooks/?&extended=1&format=json")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {
        // const bookCoverImages = [];
        // setImageData(data.books)
        // const bookData = Object.entries(imageData);
        // bookData.forEach(([key, value]) => {
          // console.log(key,value.url_zip_file)
          // listRSSURLS.push(value.urls[0].url);
        setLoadingAudioBooks(false)
      },
      );
    

    // console.log(data.books)

    // fetch('https://librivox.org/rss/52')
    // .then((response) => response.text())
    // .then((responseData) => rssParser.parse(responseData))
    // .then((rss) => {
    // console.log(rss.items[0].enclosures[0])
    // console.log(rss.items.map((item) =>{console.log(item)}))
    // console.log(rss.items[0].enclosures[0])
    // console.log(rss.items.length);
    // });
    //
  }, []);
  // keyExtractor = (item, index) => index.toString()
  // keyExtractor=({ id }, index) => id
    const bookCoverURL = []
  if (!loadingAudioBooks) {
    const dataKeys = Object.entries(data.books);
    var bookCoverImagePath;
    dataKeys.forEach(([key, value]) => {
      console.log(key,value.url_zip_file)
      bookCoverImagePath = value.url_zip_file 
      bookCoverImagePath = bookCoverImagePath.split("/");
      bookCoverImagePath = bookCoverImagePath[bookCoverImagePath.length - 2];
      bookCoverImagePath = `https://archive.org/services/get-item-image.php?identifier=${bookCoverImagePath}`;
      bookCoverURL.push(bookCoverImagePath)
  });
  }
  const navigation = useNavigation();
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index}) => (

    <ListItem bottomDivider>

    <Avatar 
    source={{uri: bookCoverURL[index]}}
    style={{ width: 150, height: 150 }}
     />
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>
          Author: {item.authors[0].first_name} {item.authors[0].last_name},
          Lived: {item.authors[0].dob} - {item.authors[0].dod}
          Genre {item.genres[0].name}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
      <Button
        onPress={() => navigation.navigate("Audio",[item.url_rss, item.id, item.url_zip_file])}
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
      <FlatList
        data={data.books}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
  }else{
    return (
      <View>
    <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
}

export default Audiobooks;
