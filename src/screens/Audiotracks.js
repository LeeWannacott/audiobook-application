import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  InteractionManager,
} from "react-native";
import {
  ListItem,
  Image,
  LinearProgress,
  Card,
  Rating,
} from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

import { openDatabase } from "../utils";

const db = openDatabase();
import {
  createTablesDB,
  updateAudioTrackPositionsDB,
  shelveAudiobookDB,
  updateBookShelveDB,
  initialAudioBookStoreDB,
  removeShelvedAudiobookDB,
  updateAudiobookRatingDB,
} from "../database_functions";

function Audiotracks(props) {
  const [AudioBookData, setAudioBookData] = useState([]);
  const [AudioBookDescription, setAudioBookDescription] = useState([]);
  const currentAudioTrackIndex = useRef(0);
  const [dataRSS, setData] = useState([]);
  const [loadingAudiobookData, setLoadingAudioBookData] = useState(true);
  const [loadingAudioListeningLinks, setLoadingAudioListeningLinks] =
    useState(true);
  const [loadingCurrentAudiotrack, setLoadingCurrentAudiotrack] =
    useState(false);
  const [loadedCurrentAudiotrack, setLoadedCurrentAudiotrack] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [Playing, SetPlaying] = useState(false);
  const [Duration, SetDuration] = useState(0);
  const [audioTrackChapterPlayingTitle, setAudioTrackChapterPlayingTitle] =
    useState("");
  const [audioTrackReader, setAudioTrackReader] = useState("");
  const [currentSliderPosition, setCurrentSliderPosition] = React.useState(0);

  const [lengthOfSections, setLengthOfSections] = useState(0);
  const [linearProgessBars, setlinearProgressBars] = useState([]);
  const [currentAudiotrackPositionsMs, setCurrentAudiotrackPositionsMs] =
    useState([]);
  const [shelveIconToggle, setShelveIconToggle] = useState(0);
  const [audiobookRating, setAudiobookRating] = useState(0);

  const [AudioBooksRSSLinkToAudioTracks, AudioBookId, bookCoverImage] =
    props.route.params;

  React.useEffect(() => {
    createTablesDB(db);
  }, []);

  const updateAudioBookPosition = (
    audiobook_id,
    audiotrack_progress_bars,
    current_audiotrack_positions
  ) => {
    console.log("updating audiobook position");
    audiotrack_progress_bars = JSON.stringify(audiotrack_progress_bars);
    current_audiotrack_positions = JSON.stringify(current_audiotrack_positions);
    updateAudioTrackPositionsDB(
      db,
      audiotrack_progress_bars,
      current_audiotrack_positions,
      audiobook_id
    );
  };

  const updateBookShelve = (audiobook_id, audiobook_shelved) => {
    console.log("updating audiobook position", audiobook_shelved);
    console.log("audiobook shelve value", audiobook_shelved);
    updateBookShelveDB(db, audiobook_id, audiobook_shelved);
  };

  const initialAudioBookStore = (
    audiobook_id,
    audiotrack_progress_bars,
    current_audiotrack_positions,
    audiobook_shelved,
    audiotrack_rating
  ) => {
    audiotrack_progress_bars = JSON.stringify(audiotrack_progress_bars);
    current_audiotrack_positions = JSON.stringify(current_audiotrack_positions);
    initialAudioBookStoreDB(
      db,
      audiobook_id,
      audiotrack_progress_bars,
      current_audiotrack_positions,
      audiobook_shelved,
      audiotrack_rating
    );

    // initial load of audiotrack data from DB.
    db.transaction((tx) => {
      tx.executeSql("select * from testaudio14", [], (_, { rows }) => {
        rows["_array"].forEach((element) => {
          if (audiobook_id == element.audiobook_id) {
            let audiobook_positions_temp = JSON.parse(
              element.audiotrack_progress_bars
            );
            let audiotrack_positionsMS = JSON.parse(
              element.current_audiotrack_positions
            );
            setlinearProgressBars(audiobook_positions_temp);
            setCurrentAudiotrackPositionsMs(audiotrack_positionsMS);
            setShelveIconToggle(element.audiobook_shelved);
            setAudiobookRating(element.audiobook_rating);
          }
        });
      });
    }, null);
  };

  const shelveAudiobook = (
    audiobook_rss_url,
    audiobook_id,
    audiobook_image
  ) => {
    shelveAudiobookDB(db, audiobook_rss_url, audiobook_id, audiobook_image);
  };

  const removeShelvedAudiobook = (audiobook_id) => {
    removeShelvedAudiobookDB(db, audiobook_id);
  };

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
      .catch((error) => console.log("Error: ", error))
      .finally(() => {
        setLoadingAudioListeningLinks(false);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://librivox.org/api/feed/audiobooks/?id=${AudioBookId}&extended=1&format=json`
    )
      .then((response) => response.json())
      .then((json) => {
        return (
          setAudioBookData(json.books),
          setLengthOfSections(json.books[0].sections.length)
        );
      })
      .catch((error) => console.log("Error: ", error))
      .finally(() => setLoadingAudioBookData(false));
  }, []);

  useEffect(() => {
    let initialAudioBookSections = new Array(lengthOfSections).fill(0);
    setlinearProgressBars(initialAudioBookSections);
    setCurrentAudiotrackPositionsMs(initialAudioBookSections);
    // will only happen if no entry in db already.
    initialAudioBookStore(
      AudioBookId,
      initialAudioBookSections,
      initialAudioBookSections,
      shelveIconToggle,
      audiobookRating
    );
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.current.unloadAsync();
        }
      : undefined;
  }, [sound.current]);

  function updateAndStoreAudiobookPositions(data){
        console.log(
          data.positionMillis,
          data.durationMillis,
          currentSliderPosition
        );
        let sliderPositionCalculate =
          (data.positionMillis / data.durationMillis) * 100;
        setCurrentSliderPosition(sliderPositionCalculate);

        let updatedLinearProgessBarPositions = [...linearProgessBars];
        updatedLinearProgessBarPositions[currentAudioTrackIndex.current] =
          linearProgessBars[currentAudioTrackIndex.current] =
            data.positionMillis / data.durationMillis;
        setlinearProgressBars(updatedLinearProgessBarPositions);

        let updatedCurrentAudiotrackPositions = [
          ...currentAudiotrackPositionsMs,
        ];
        updatedCurrentAudiotrackPositions[currentAudioTrackIndex.current] =
          currentAudiotrackPositionsMs[currentAudioTrackIndex.current] =
            data.positionMillis;
        setCurrentAudiotrackPositionsMs(updatedCurrentAudiotrackPositions);

        updateAudioBookPosition(
          AudioBookId,
          linearProgessBars,
          currentAudiotrackPositionsMs
        );
  }

  const UpdateStatus = async (data) => {
    try {
      if (data.didJustFinish) {
        console.log("Finished!!!");
        updateAndStoreAudiobookPositions(data)
        return HandleNext(currentAudioTrackIndex.current);
      } else if (data.positionMillis && data.durationMillis) {
        updateAndStoreAudiobookPositions(data)
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const SeekUpdate = async (data) => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded == true) {
        const result = (data / 100) * Duration;
        return await sound.current.setPositionAsync(Math.round(result));
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const ResetPlayer = async () => {
    try {
      const checkLoading = await sound.current.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        SetPlaying(false);
        await sound.current.setPositionAsync(0);
        await sound.current.stopAsync();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const LoadAudio = async (index, audiotrackPositions = 0) => {
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
            progressUpdateIntervalMillis: 5000,
            positionMillis: audiotrackPositions,
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
          setAudioTrackChapterPlayingTitle(
            AudioBookData[0].sections[index].section_number +
              ". " +
              AudioBookData[0].sections[index].title
          );
          setAudioTrackReader(
            AudioBookData[0].sections[index].readers[0]["display_name"]
          );
          InteractionManager.runAfterInteractions(() => {
            // ...long-running synchronous task...
            sound.current.setOnPlaybackStatusUpdate(UpdateStatus);
          });
          setLoadingCurrentAudiotrack(false);
          setLoadedCurrentAudiotrack(true);
          SetDuration(result.durationMillis);
          PlayAudio();
        }
      } catch (error) {
        setLoadingCurrentAudiotrack(false);
        setLoadedCurrentAudiotrack(false);
        console.log("Error: ", error);
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
          sound.current.playAsync();
          SetPlaying(true);
        }
      }
    } catch (error) {
      SetPlaying(false);
      console.log("Error: ", error);
    }
  };

  const PauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
          SetPlaying(false);
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      SetPlaying(true);
    }
  };

  const HandleNext = async () => {
    if (currentAudioTrackIndex.current < listRSSURLS.length - 1) {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        currentAudioTrackIndex.current += 1;
        setCurrentSliderPosition(0);
        // ResetPlayer();
        return LoadAudio(
          currentAudioTrackIndex.current,
          currentAudiotrackPositionsMs[currentAudioTrackIndex.current]
        );
      }
    } else if (currentAudioTrackIndex.current >= listRSSURLS.length - 1) {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        currentAudioTrackIndex.current = 0;
        setCurrentSliderPosition(0);
        ResetPlayer();
        return LoadAudio(
          currentAudioTrackIndex.current,
          currentAudiotrackPositionsMs[currentAudioTrackIndex.current]
        );
      }
    }
  };

  const HandlePrev = async () => {
    if (currentAudioTrackIndex.current - 1 >= 0) {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        LoadAudio(
          currentAudioTrackIndex.current - 1,
          currentAudiotrackPositionsMs[currentAudioTrackIndex.current - 1]
        );
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
        setCurrentSliderPosition(0);
        ResetPlayer();
        return LoadAudio(index, currentAudiotrackPositionsMs[index]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const keyExtractor = (item, index) => index.toString();
  // TODO: error handle if null/undefined i.e no reader listed/read by.
  const renderItem = ({ item, index }) => (
    <View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            {item.section_number}: {item.title}
          </ListItem.Title>
          <ListItem.Subtitle>{item.genres}</ListItem.Subtitle>
          <ListItem.Subtitle>
            Read by: {item.readers[0]["display_name"]}
          </ListItem.Subtitle>
          <LinearProgress
            color="primary"
            value={linearProgessBars[index]}
            variant="determinate"
            trackColor="lightblue"
          />
          <ListItem.Subtitle>
            Playtime: {chapterDurations[index]}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
        <MaterialIconCommunity
          name="book-play"
          onPress={() => {
            PlayFromListenButton(index);
          }}
          size={40}
          color="#841584"
        />
      </ListItem>
    </View>
  );

  const rssURLS = Object.entries(dataRSS);
  const listRSSURLS = rssURLS.map(([key, value]) => {
    return value.enclosures[0].url;
  });

  const chapterDurations = dataRSS.map((item) => item["itunes"].duration);
  console.log(chapterDurations);

  function ratingCompleted(rating) {
    updateAudiobookRatingDB(db, AudioBookId, rating);
  }

  function pressedToShelveBook(
    audiobook_rss_url,
    audiobook_id,
    audiobook_image
  ) {
    switch (shelveIconToggle) {
      case 0:
        setShelveIconToggle(1);
        shelveAudiobook(audiobook_rss_url, audiobook_id, audiobook_image);
        updateBookShelve(audiobook_id, !shelveIconToggle);
        break;
      case 1:
        // remove from db
        setShelveIconToggle(0);
        updateBookShelve(audiobook_id, !shelveIconToggle);
        removeShelvedAudiobook(audiobook_id);
        break;
    }
  }

  if (!loadingAudioListeningLinks && !loadingAudiobookData) {
    const getHeader = () => {
      return (
        <View style={styles.bookHeader}>
          <Card>
            <Card.Title style={styles.bookTitle}>
              {" "}
              {AudioBookData[0].title}
            </Card.Title>
            <Card.Divider />
            <Card.Image
              source={{ uri: bookCoverImage }}
              style={{
                width: 200,
                height: 200,
                marginBottom: 20,
                marginLeft: 35,
              }}
            />
            <Text style={styles.bookAuthor}>
              {" "}
              Author: {AudioBookData[0].authors[0].first_name}{" "}
              {AudioBookData[0].authors[0].last_name}
            </Text>
            <Text style={styles.bookDescription}>
              {AudioBookDescription.description}
            </Text>
            <Rating
              showRating
              ratingCount={5}
              startingValue={audiobookRating}
              onFinishRating={ratingCompleted}
              style={{ paddingVertical: 10 }}
            />
            <MaterialIconCommunity
              name={shelveIconToggle ? "book" : "book-outline"}
              size={50}
              color={shelveIconToggle ? "black" : "black"}
              onPress={() => {
                pressedToShelveBook(
                  AudioBooksRSSLinkToAudioTracks,
                  AudioBookId,
                  bookCoverImage
                );
                console.log("test");

                // navigation.navigate("Home", []);
              }}
            />
            <Text> Total playtime: {AudioBookData[0].totaltime} </Text>
          </Card>
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
            value={currentSliderPosition}
            allowTouchTrack={true}
            minimumValue={0}
            maximumValue={100}
            onSlidingComplete={(data) => SeekUpdate(data)}
          />
          <View style={styles.AudiobookTime}>
            <Text style={{ marginLeft: 10 }}>
              {" "}
              {GetDurationFormat((currentSliderPosition * Duration) / 100)}{" "}
            </Text>
            <Text style={{ marginRight: 10 }}>
              {" "}
              {GetDurationFormat(Duration)}
            </Text>
          </View>

          <View style={styles.SliderContainer}>
            <Image
              source={{ uri: bookCoverImage }}
              style={{
                width: 50,
                height: 50,
                marginRight: 5,
              }}
            />
            <View>
              <Text numberOfLines={2} ellipsizeMode="tail" style={{}}>
                {" "}
                {audioTrackChapterPlayingTitle}{" "}
              </Text>
              <Text numberOfLines={1} ellipsizeMode="tail">
                {" "}
                {audioTrackReader}{" "}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.controlsVert}>
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => HandlePrev()}>
              <MaterialIcons
                name="skip-previous"
                size={50}
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
                <MaterialIcons
                  name="not-started"
                  size={50}
                  color="black"
                  style={styles.control}
                />
              </TouchableOpacity>
            ) : Playing ? (
              <TouchableOpacity onPress={() => PauseAudio()}>
                <MaterialIcons
                  name="pause"
                  size={50}
                  color="black"
                  style={styles.control}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <MaterialIcons
                  name="play-arrow"
                  size={50}
                  color="black"
                  style={styles.control}
                  onPress={() => PlayAudio()}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => HandleNext()}>
              <MaterialIcons
                name="skip-next"
                size={50}
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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkgreen",
    padding: 10,
  },
  AudioTracksStyle: {
    flex: 7,
    marginBottom: 20,
  },
  controlsVert: {
    flex: 0.8,
  },
  controls: {
    flex: 1,
    // top:-100,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  AudiobookTime: {
    display: "flex",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    // top: -200,
    // padding: 10,
    minHeight: 20,
  },
  SliderStyle: {
    backgroundColor: "white",
    // top: -200,
    // padding: 10,
    // flex: 1,
  },
  SliderContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: 5,
    maxWidth: windowWidth - 70,
  },
  listItemHeaderStyle: {
    fontSize: 20,
    top: 20,
    backgroundColor: "black",
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2,
    color: "green",
  },
  bookTitle: {
    // top:100,
    fontSize: 30,
  },
  bookAuthor: {
    // top:100,
    fontWeight: "bold",
  },
  bookDescription: {
    // top:100,
    fontSize: 16,
    padding: 2,
  },
  bookHeader: {
    display: "flex",
    paddingBottom: 10,
    padding: 2,
  },
  albumCover: {
    width: 250,
    height: 250,
  },
  control: {
    height: 50,
    backgroundColor: "black",
    borderRadius: 25,
    color: "purple",
    margin: 30,
  },
});

export default Audiotracks;
