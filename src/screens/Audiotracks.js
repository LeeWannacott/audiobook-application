import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  ListItem,
  Image,
  Tile,
  LinearProgress,
  Rating,
} from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
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
  const currentAudioTrackIndex = useRef(0);
  const [data, setData] = useState([]);
  const [linearProgessBar, setlinearProgressBar] = useState(0);
  const [loadingAudiobookData, setLoadingAudioBookData] = useState(true);
  const [loadingAudioListeningLinks, setLoadingAudioListeningLinks] =
    useState(true);
  const [loadingCurrentAudiotrack, setLoadingCurrentAudiotrack] =
    useState(false);
  const [loadedCurrentAudiotrack, setLoadedCurrentAudiotrack] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [audioTrackLength, setAudioTrackLength] = useState(0);
  const [Playing, SetPlaying] = useState(false);
  const [Duration, SetDuration] = useState(0);
  const [audioTrackPlayingTitle, setAudioTrackPlayingTitle] = useState("");
  const [currentAudiotrackPosition, setCurrentAudiotrackPosition] =
    React.useState(0);

  const [AudioBooksRSSLinkToAudioTracks, AudioBookId, bookCoverImage] =
    props.route.params;

  useEffect(() => {
    async function setAudioMode() {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: true,
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
        });
      } catch (e) {
        console.log(e);
      }
    }
    setAudioMode();
  }, []);
  const sound = React.useRef(new Audio.Sound());

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
        setLoadingAudioListeningLinks(false);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://librivox.org/api/feed/audiobooks/?id=${AudioBookId}&extended=1&format=json`
    )
      .then((response) => response.json())
      .then((json) => setAudioBookData(json.books))
      .catch((error) => console.error(error))
      .finally(() => setLoadingAudioBookData(false));
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.current.unloadAsync();
        }
      : undefined;
  }, [sound.current]);

  const UpdateStatus = async (data) => {
    try {
      if (data.didJustFinish) {
        return HandleNext(CurrentIndex + 1);
      } else if (data.positionMillis && data.durationMillis) {
        console.log(
          data.positionMillis,
          data.durationMillis,
          currentAudiotrackPosition
        );
        return setCurrentAudiotrackPosition(
          ((data.positionMillis / data.durationMillis) * 100).toFixed(2)
        );
      }
    } catch (error) {
      console.log("Error");
    }
  };

  const SeekUpdate = async (data) => {
    try {
      const result = await sound.current.getStatusAsync();
      console.log("seek update");
      if (result.isLoaded == true) {
        const result = (data / 100) * Duration;
        return await sound.current.setPositionAsync(Math.round(result));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const ResetPlayer = async () => {
    try {
      const checkLoading = await sound.current.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        setCurrentAudiotrackPosition(0);
        SetPlaying(false);
        await sound.current.setPositionAsync(0);
        await sound.current.stopAsync();
      }
    } catch (error) {
      console.log("Error");
    }
  };

  const LoadAudio = async (index) => {
    currentAudioTrackIndex.current = index;
    setLoadingCurrentAudiotrack(true);
    console.log(index, "Playing");
    const checkLoading = await sound.current.getStatusAsync();
    // console.log(listRSSURLS[index]);
    // console.log(AudioBookData[0].sections[index].title);
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync(
          { uri: listRSSURLS[index] },
          {
            progressUpdateIntervalMillis: 1000,
            positionMillis: 0,
            shouldPlay: false,
            rate: 1.0,
            shouldCorrectPitch: false,
            volume: 1.0,
            isMuted: false,
            isLooping: false,
          },
          true
        );
        if (result.isLoaded === false) {
          setLoadingCurrentAudiotrack(false);
          setLoadedCurrentAudiotrack(false);
        } else {
          setAudioTrackPlayingTitle(AudioBookData[0].sections[index].title);
          sound.current.setOnPlaybackStatusUpdate(UpdateStatus);
          setLoadingCurrentAudiotrack(false);
          setLoadedCurrentAudiotrack(true);
          SetDuration(result.durationMillis);
          PlayAudio();
        }
      } catch (error) {
        setLoadingCurrentAudiotrack(false);
        setLoadedCurrentAudiotrack(false);
      }
    } else {
      setLoadingCurrentAudiotrack(false);
      setLoadedCurrentAudiotrack(true);
    }
  };

  const PlayAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          console.log("playing");
          SetPlaying(true);
          return sound.current.playAsync();
        }
      }
    } catch (error) {
      console.log(error);
      return SetPlaying(false);
    }
  };

  const PauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded && result.isPlaying) {
        SetPlaying(false);
        return sound.current.pauseAsync();
      }
    } catch (error) {
      console.log(error);
      return SetPlaying(true);
    }
  };

  const HandleNext = async () => {
    if (currentAudioTrackIndex.current < listRSSURLS.length - 1) {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        currentAudioTrackIndex.current += 1;
        return LoadAudio(currentAudioTrackIndex.current);
      }
    } else if (currentAudioTrackIndex.current >= listRSSURLS.length - 1) {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        currentAudioTrackIndex.current = 0;
        return LoadAudio(currentAudioTrackIndex.current);
      }
    }
  };

  const HandlePrev = async () => {
    if (currentAudioTrackIndex.current - 1 >= 0) {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        LoadAudio(currentAudioTrackIndex.current - 1);
        currentAudioTrackIndex.current -= 1;
      }
    }
  };

  const GetDurationFormat = (duration) => {
    const time = duration / 1000;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    const secondsFormatted = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${secondsFormatted}`;
  };

  const PlayFromListenButton = async (index) => {
    try {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        return LoadAudio(index);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
            PlayFromListenButton(index);
          }}
          title="Listen"
          color="#841584"
          accessibilityLabel="purple button"
        />
      </ListItem>
    </View>
  );

  const listRSSURLS = [];
  const rssURLS = Object.entries(data);
  rssURLS.forEach(([key, value]) => {
    listRSSURLS.push(value.enclosures[0].url);
  });

  function ratingCompleted(rating) {
    // console.log("Rating is: " + rating)
  }

  if (!loadingAudioListeningLinks && !loadingAudiobookData) {
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
          <Rating
            showRating
            ratingCount={5}
            startingValue={0}
            onFinishRating={ratingCompleted}
            style={{ paddingVertical: 10 }}
          />
          <Text> Total time: {AudioBookData[0].totaltime} </Text>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.AudioTracksStyle}>
          <View style={styles.listItemHeaderStyle}>
            <FlatList
              data={AudioBookData[0].sections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ListHeaderComponent={getHeader()}
            />
          </View>
        </View>

        <View style={styles.SliderStyle}>
          <Slider
            value={currentAudiotrackPosition}
            allowTouchTrack={true}
            minimumValue={0}
            maximumValue={100}
            onSlidingComplete={(data) => SeekUpdate(data)}
          />
          <Text>
            <Text>
              {" "}
              {GetDurationFormat(
                (currentAudiotrackPosition * Duration) / 100
              )}{" "}
            </Text>
            <Text> {GetDurationFormat(Duration)}</Text>
          </Text>

          <Text> {audioTrackPlayingTitle}</Text>
        </View>
        <View style={styles.controlsVert}>
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => HandlePrev()}>
              <MaterialIcons
                name="skip-previous"
                size={40}
                color="black"
                style={styles.control}
              />
            </TouchableOpacity>

            {loadingCurrentAudiotrack ? (
              <ActivityIndicator size={"large"} color={"dodgerblue"} />
            ) : loadedCurrentAudiotrack === false ? (
              <TouchableOpacity
                onPress={() => LoadAudio(currentAudioTrackIndex.current)}
              >
                <Ionicons
                  name="md-reload-sharp"
                  size={30}
                  color="black"
                  style={styles.control}
                />
              </TouchableOpacity>
            ) : Playing ? (
              <TouchableOpacity onPress={() => PauseAudio()}>
                <Entypo
                  name="controller-paus"
                  size={40}
                  color="black"
                  style={styles.control}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Entypo
                  name="controller-play"
                  size={40}
                  color="black"
                  style={styles.control}
                  onPress={() => PlayAudio()}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => HandleNext()}>
              <MaterialIcons
                name="skip-next"
                size={40}
                color="black"
                style={styles.control}
              />
            </TouchableOpacity>
          </View>
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
    flex: 1,
    backgroundColor: "blue",
    padding: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
  AudioTracksStyle: {
    flex: 8,
  },
  controlsVert: {
    flex: 1,
  },
  controls: {
    flex: 1,
    // top:-100,
    flexDirection: "row",
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  SliderStyle: {
    backgroundColor: "purple",
    // top: -200,
    // padding: 10,
    flex: 1,
  },
  listItemHeaderStyle: {
    fontSize: 20,
    top: 20,
    backgroundColor: "red",
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
  control: {
    backgroundColor: "blue",
    color: "purple",
    margin: 30,
  },
});

export default Audiotracks;
