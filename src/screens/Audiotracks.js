import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { ListItem, Image, Tile, LinearProgress } from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
// import Sound from 'react-native-sound';
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

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
  const [sliderValue, setSliderValue] = useState(0);
  const [linearProgessBar, setlinearProgressBar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [volume, setVolume] = useState(1.0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentAudioTrackIndex, setCurrentAudioTrackIndex] = useState(0);

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

  async function playSound(itemURL, index) {
    console.log("Loading Sound");
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    setCurrentAudioTrackIndex(index);
    const { sound } = await Audio.Sound.createAsync({ uri: itemURL });

    // );
    // const status = {
    // shouldPlay: isPlaying,
    // volume,
    // };
    // onPlaybackStatusUpdate = (status) => {
    // setIsBuffering(status);
    // };
    setSound(sound);
    setIsPlaying(true);
    console.log("Playing Sound");
    await sound.playAsync();
    // sound.setStatusAsync({ shouldPlay: true, positionMillis: 8000 });
    console.log(sound.getStatusAsync());
  }

  const handlePlayPause = async () => {
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
    setIsPlaying(!isPlaying);
  };

  const handlePreviousTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
      currentAudioTrackIndex < listRSSURLS.length - 1 &&
      currentAudioTrackIndex >= 1
        ? setCurrentAudioTrackIndex((currentAudioTrackIndex - 1))
        : setCurrentAudioTrackIndex((0));
      playSound(listRSSURLS[currentAudioTrackIndex], currentAudioTrackIndex);
    }
  };

  const handleNextTrack = async () => {
    if (sound) {
      console.log(currentAudioTrackIndex, listRSSURLS.length - 1);
      await sound.unloadAsync();
      currentAudioTrackIndex < listRSSURLS.length - 1
        ? setCurrentAudioTrackIndex((currentAudioTrackIndex + 1))
        : setCurrentAudioTrackIndex(0);
      playSound(listRSSURLS[currentAudioTrackIndex], currentAudioTrackIndex);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          // setSliderValue(0.4)
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  function changeSliderValue() {
    if (isPlaying) {
      // setSliderValue(0.5);
      setSliderValue(0.4);
    }
  }
  function printHello(hey) {
    console.log(hey);
  }

  const listRSSURLS = [];
  const rssURLS = Object.entries(data);
  rssURLS.forEach(([key, value]) => {
    listRSSURLS.push(value.enclosures[0].url);
  });

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
          <LinearProgress
            color="primary"
            value={linearProgessBar}
            variant="determinate"
          />
        </ListItem.Content>
        <ListItem.Chevron />
        <Button
          onPress={() => playSound(listRSSURLS[index], index)}
          title="Listen"
          color="#841584"
          accessibilityLabel="purple button"
        />
      </ListItem>
    </View>
  );

  if (!loading && !loading2) {
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
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.control}
            onPress={() => handlePreviousTrack()}
          >
            <Ionicons name="play-back" size={48} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.control}
            onPress={() => handlePlayPause()}
          >
            {isPlaying ? (
              <Ionicons name="pause-circle" size={48} color="#444" />
            ) : (
              <Ionicons name="play" size={48} color="#444" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.control}
            onPress={() => handleNextTrack()}
          >
            <Ionicons name="play-forward" size={48} color="#444" />
          </TouchableOpacity>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    backgroundColor: "purple",
    alignContent: "flex-end",
    top: 100,
    padding: 10,
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
  albumCover: {
    width: 250,
    height: 250,
  },
  controls: {
    flexDirection: "row",
    backgroundColor: "red",
    top: -100,
  },
  control: {
    backgroundColor: "blue",
    color: "purple",
    margin: 30,
  },
});

export default Audiotracks;
