import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { ListItem, Image, Tile } from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
// import Sound from 'react-native-sound';
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

import {
  FlatList,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function Audiotracks(props) {
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState([]);
  const [AudioBookData, setAudioBookData] = useState([]);
  const [AudioBookDescription, setAudioBookDescription] = useState([]);
  const [sound, setSound] = React.useState();
  const [imageURL, setImageURL] = React.useState();
  const [isPlaying, setisPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [
    AudioBooksRSSLinkToAudioTracks,
    AudioBookId,
    bookCoverImage,
  ] = props.route.params;

  // useEffect(() => {
    // console.log(urlZipFile, "test");
    // if (urlZipFile.length !== 0) {
      // var bookCoverImagePath = urlZipFile;
      // bookCoverImagePath = bookCoverImagePath.split("/");
      // bookCoverImagePath = bookCoverImagePath[bookCoverImagePath.length - 2];
      // console.log(bookCoverImagePath, "test1");
      // bookCoverImagePath = `https://archive.org/services/get-item-image.php?identifier=${bookCoverImagePath}`;
      // setImageURL(bookCoverImagePath);
    // }
  // }, []);

  useEffect(() => {
    fetch(AudioBooksRSSLinkToAudioTracks)
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        setData(rss.items);
        setAudioBookDescription(rss);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        const listRSSURLS = [];
        const rssURLS = Object.entries(data);
        rssURLS.forEach(([key, value]) => {
          listRSSURLS.push(value.enclosures[0].url);
        });
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://librivox.org/api/feed/audiobooks/?id=${AudioBookId}&extended=1&format=json`
    )
      .then((response) => response.json())
      .then((json) => setAudioBookData(json.books))
      .catch((error) => console.error(error))
      .finally(() => setLoading2(false));
  }, []);

  async function playSound(itemURL) {
    console.log("Loading Sound");
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    const { sound } = await Audio.Sound.createAsync({ uri: itemURL });
    setSound(sound);

    setisPlaying(true);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  function changeSliderValue() {
    if (isPlaying) {
      // setSliderValue(0.5);
      setSliderValue(0.4);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          // setSliderValue(0.4)
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  // console.log(data)
  const listRSSURLS = [];
  const rssURLS = Object.entries(data);
  rssURLS.forEach(([key, value]) => {
    listRSSURLS.push(value.enclosures[0].url);
    // console.log(value)
  });

  // const imageData = Object.entries(AudioBookData);
  // console.log(imageData[0][1].url_iarchive);

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            {item.section_number}: {item.title}
          </ListItem.Title>
          <ListItem.Subtitle>{item.genres}</ListItem.Subtitle>
          <ListItem.Subtitle>
            Read by: {item.readers[0].display_name}
          </ListItem.Subtitle>
          <ListItem.Subtitle>Playtime: {item.playtime}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />

        <Button
          onPress={() => playSound(listRSSURLS[index])}
          title="Listen"
          color="#841584"
          accessibilityLabel="purple button"
        />
      </ListItem>
    </View>
  );

  if (!loading && !loading2) {
    // const imageData = Object.entries(AudioBookData);
    // console.log(imageData[0][1].url_iarchive);
    // let AudioBooksCoverImage = imageData[0][1].url_iarchive;
    // AudioBooksCoverImage = AudioBooksCoverImage.substr(
      // AudioBooksCoverImage.lastIndexOf("/") + 1
    // );
    // console.log(AudioBooksCoverImage);
    const getHeader = () => {
      return (
        <View style={styles.bookHeader}>
          <Text style={styles.bookTitle}> {AudioBookData[0].title}</Text>
          <Image
            source={{ uri: bookCoverImage }}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.bookDescription}>
            {" "}
            By {AudioBookData[0].authors[0].first_name}{" "}
            {AudioBookData[0].authors[0].last_name}
          </Text>
          <Text style={styles.bookDescription}>
            {" "}
            Description: {AudioBookDescription.description}
          </Text>
          <Text> Total time: {AudioBookData[0].totaltime} </Text>
        </View>
      );
    };
    return (
      <View style={styles.container}>
        <View style={styles.listItemHeaderStyle}>
          <FlatList
            data={AudioBookData[0].sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={getHeader}
          />
        </View>
        <View style={styles.bottom}>
          <Slider
            style={{ width: 320, height: 40 }}
            value={sliderValue}
            onValueChange={(sliderValue) => {
              setSliderValue(sliderValue);
            }}
            step={0.1}
            allowTouchTrack={true}
            minimumValue={0}
            maximumValue={100}
          />
          <Text>{sliderValue} world</Text>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: "blue",
  },
  bottom: {
    backgroundColor: "purple",
    alignContent: "flex-end",
    // top:100,
    padding: 10,
    top: -100,
  },
  listItemHeaderStyle: {
    fontSize: 20,
    top: 10,
  },
  ActivityIndicatorStyle: {
    top: 100,
    // top:100,
  },
  bookTitle: {
    // top:100,
    fontSize: 30,
  },
  bookDescription: {
    // top:100,
    fontSize: 14,
  },
  bookHeader: {
    padding: 10,
  },
});

export default Audiotracks;
