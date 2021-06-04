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
  const [AudioBookData, setAudioBookData] = useState([]);
  const [AudioBookDescription, setAudioBookDescription] = useState([]);
  const [currentAudioTrackIndex, setCurrentAudioTrackIndex] = useState(0);
  const [data, setData] = useState([]);
  const [imageURL, setImageURL] = React.useState();
  const [isBuffering, setIsBuffering] = useState(false);
  const [linearProgessBar, setlinearProgressBar] = useState(0);
  const [loading2, setLoading2] = useState(true);
  const [loading, setLoading] = useState(true);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [sound, setSound] = React.useState();
  const [volume, setVolume] = useState(1.0);
  const [audioTrackLength, setAudioTrackLength] = useState(0);
  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const [Playing, SetPlaying] = React.useState(false);
  const [Duration, SetDuration] = React.useState(0);
  const [Value, SetValue] = React.useState(0);
  // const sound = React.useRef(new Audio.Sound());

  const [
    AudioBooksRSSLinkToAudioTracks,
    AudioBookId,
    bookCoverImage,
  ] = props.route.params;

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
          // console.log(value);
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

  const UpdateStatus = async (data) => {
    try {
      if (data.didJustFinish) {
        console.log("hello");
        ResetPlayer();
      } else if (data.positionMillis && Playing === true) {
        console.log(Value, "beep1", data.positionMillis, data.durationMillis);
        if (data.durationMillis) {
          console.log(Value, "beep2", data.positionMillis, data.durationMillis);
          let positionInAudiobook = ((data.positionMillis / data.durationMillis) * 100)
          SetValue(positionInAudiobook);
          console.log(Value, "beep3", data.positionMillis, data.durationMillis);
        }
      }
    } catch (error) {
      console.log("Error");
      console.log("yelop");
    }
  };

  const SeekUpdate = async (data) => {
    try {
      sound.getStatusAsync();
      if (sound.isLoaded === true) {
        const result = (data / 100) * Duration;
        await sound.current.setPositionAsync(Math.round(result));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  // const LoadAudio = async (itemURL, index, time) => {
  // SetLoading(true);
  // console.log("playing");
  // if (sound) {
  // const checkLoading = await sound.getStatusAsync();
  // if (checkLoading.isLoaded === false) {
  // try {
  // const result = await sound.loadAsync( { uri: itemURL },{},true);
  // const { sound } = await Audio.Sound.createAsync({ uri: itemURL });
  // setSound(sound);
  // if (sound.isLoaded === false) {
  // SetLoading(false);
  // SetLoaded(false);
  // console.log("Error in Loading Audio");
  // } else {
  // sound.playAsync();
  // sound.setOnPlaybackStatusUpdate(UpdateStatus);
  // console.log(UpdateStatus)
  // SetLoading(false);
  // SetLoaded(true);
  // SetDuration(sound.durationMillis);
  // console.log(duration)
  // console.log("update");
  // }
  // } catch (error) {
  // SetLoading(false);
  // SetLoaded(false);
  // console.log(error);
  // }
  // } else {
  // SetLoading(false);
  // SetLoaded(true);
  // }
  // } else {
  // const { sound } = await Audio.Sound.createAsync({ uri: itemURL });
  // setSound(sound);
  // sound.playAsync();
  // sound.setOnPlaybackStatusUpdate(UpdateStatus);
  // SetLoading(false);
  // SetLoaded(true);
  // SetDuration(sound.durationMillis);
  // console.log("update2");
  // return;
  // }
  // };

  const ResetPlayer = async () => {
    try {
      const checkLoading = await sound.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        SetValue(0);
        SetPlaying(false);
        await sound.setPositionAsync(0);
        await sound.stopAsync();
      }
    } catch (error) {
      console.log("Error");
    }
  };

  async function playSound(itemURL, index, time) {
    console.log(index, currentAudioTrackIndex);
    console.log(time * 1000, "time");
    try {
      console.log("Loading Sound");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true,
      });
      const { sound } = await Audio.Sound.createAsync({ uri: itemURL });
      setSound(sound);
      await sound.playAsync();
      SetPlaying(true);
      sound.setStatusAsync({ progressUpdateIntervalMillis: 100 });
      // SetDuration(sound.durationMillis)
      sound.setOnPlaybackStatusUpdate(UpdateStatus);
      console.log("Playing Sound");
      // sound.setStatusAsync({ shouldPlay: true, positionMillis: 8000 });

      console.log(2, sound.getStatusAsync());
    } catch (error) {
      console.log(error);
    }
  }

  const handlePlayPause = async () => {
    if (!sound) {
      console.log("else");
      playSound(listRSSURLS[currentAudioTrackIndex], currentAudioTrackIndex);
      setCurrentAudioTrackIndex(currentAudioTrackIndex + 1);
    } else {
      Playing ? await sound.pauseAsync() : await sound.playAsync();
      SetPlaying(!Playing);
    }
  };

  const handlePlayAudio = async () => {
    try {
      await sound.getStatusAsync();
      if (sound.isLoaded) {
        if (sound.Playing === false) {
          sound.playAsync();
          SetPlaying(true);
        }
      }
    } catch (error) {
      SetPlaying(false);
    }
  };

  const handlePauseAudio = async () => {
    try {
      await sound.getStatusAsync();
      if (sound.isLoaded) {
        if (result.Playing === true) {
          sound.pauseAsync();
          SetPlaying(false);
        }
      }
    } catch (error) {
      SetPlaying(true);
    }
  };

  const handlePreviousTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
      currentAudioTrackIndex < listRSSURLS.length - 1 &&
      currentAudioTrackIndex >= 1
        ? setCurrentAudioTrackIndex(currentAudioTrackIndex - 1)
        : setCurrentAudioTrackIndex(0);
      playSound(listRSSURLS[currentAudioTrackIndex], currentAudioTrackIndex);
    }
  };

  const handleNextTrack = async () => {
    if (sound) {
      console.log(currentAudioTrackIndex, listRSSURLS.length - 1);
      await sound.unloadAsync();
      currentAudioTrackIndex < listRSSURLS.length - 1
        ? setCurrentAudioTrackIndex(currentAudioTrackIndex + 1)
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

  // function changeSliderValue() {
  // if (Playing) {
  // setSliderValue(0.5);
  // setSliderValue(0.4);
  // }
  // }

  const changeSliderValue = async (data) => {
    try {
      const checkLoading = await sound.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        const result = (data / 100) * Duration;
        await sound.setPositionAsync(Math.round(result));
      }
    } catch (error) {
      console.log("Error");
    }
  };

  function printHello(hey) {
    console.log(hey);
  }
  const GetDurationFormat = (duration) => {
    let time = duration / 1000;
    let minutes = Math.floor(time / 60);
    let timeForSeconds = time - minutes * 60;
    let seconds = Math.floor(timeForSeconds);
    let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${secondsReadable}`;
  };

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
          onPress={() => {
            setCurrentAudioTrackIndex(index);
            playSound(listRSSURLS[index], index, item.playtime);
            setAudioTrackLength(item.playtime * 1000);
          }}
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
            value={Value}
            // onValueChange={(Value) => {
            // setSliderValue(sliderValue);
            // }}
            // step={0.1}
            allowTouchTrack={true}
            minimumValue={0}
            maximumValue={100}
            onSlidingComplete={(data) => SeekUpdate(data)}
          />
          <Text>{Value} world</Text>
          <Text>{audioTrackLength} length track</Text>
          <Text>
            {Playing
              ? GetDurationFormat((Value * Duration) / 100)
              : GetDurationFormat(Duration)}
          </Text>
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
            {Playing ? (
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
    top: -300,
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
