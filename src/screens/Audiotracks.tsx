import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Switch,
  BackHandler,
} from "react-native";
import { ListItem, LinearProgress, Card } from "react-native-elements";
import { Rating } from "react-native-ratings";
import * as rssParser from "react-native-rss-parser";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, SectionList, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import { Button } from "react-native-paper";
import AudioTrackControls from "../components/audioTrackControls";
import AudioTrackSettings from "../components/audioTrackSettings";
import AudiotrackSliderWithCurrentPlaying from "../components/AudiotrackSliderWithCurrentPlaying";

import { openDatabase } from "../utils";
import { useNavigation } from "@react-navigation/native";

const db = openDatabase();
import {
  createTablesDB,
  updateAudioTrackPositionsDB,
  shelveAudiobookDB,
  updateBookShelveDB,
  initialAudioBookStoreDB,
  removeShelvedAudiobookDB,
  updateRatingForHistory,
  updateListeningProgress,
} from "../database_functions";

import { getAsyncData, storeAsyncData } from "../database_functions";

function Audiotracks(props: any) {
  const [chapters, setChapters] = useState([]);
  const [dataRSS, setDataRSS] = useState<any[]>([]);
  const [URLSToPlayAudiotracks, setURLSToPlayAudiotracks] = useState<any[]>([]);
  const [reviews, setAudiobookReviews] = useState([]);
  const [AudioBookDescription, setAudioBookDescription] = useState("");
  const currentAudioTrackIndex = useRef(0);
  const [loadingAudiobookData, setLoadingAudioBookData] = useState(true);
  const [loadingAudioListeningLinks, setLoadingAudioListeningLinks] =
    useState(true);
  const [loadingCurrentAudiotrack, setLoadingCurrentAudiotrack] =
    useState(false);
  const [loadedCurrentAudiotrack, setLoadedCurrentAudiotrack] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);
  const [Playing, SetPlaying] = useState(false);
  const [Duration, SetDuration] = useState(0);
  const [audioTrackChapterPlayingTitle, setAudioTrackChapterPlayingTitle] =
    useState("");
  const [audioTrackReader, setAudioTrackReader] = useState("");
  const [currentSliderPosition, setCurrentSliderPosition] = React.useState(0.0);
  const [controlPanelButtonSize] = useState(30);
  const [visible, setVisible] = useState(false);
  const [bookAmountRead, setBookAmountRead] = useState(0.0);
  // const [pitchCorrection, setPitchCorrection] = useState(true);
  const [audioPlayerSettings, setAudioPlayerSettings] = useState({
    rate: 1.0,
    shouldCorrectPitch: true,
    volume: 1.0,
    isMuted: false,
    isLooping: false,
    shouldPlay: false,
  });
  const [audiotracksData, setAudiotracksData] = useState<any>({
    linearProgessBars: [],
    currentAudiotrackPositionsMs: [],
    shelveIconToggle: 0,
    audiobookRating: 0,
    totalAudioBookListeningProgress: 0,
    totalAudioBookListeningTimeMS: 0,
  });

  const [audioModeSettings, setAudioModeSettings] = useState({
    staysActiveInBackground: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
  });

  const {
    audioBooksRSSLinkToAudioTracks,
    audioBookId,
    bookCoverImage,
    numberBookSections,
    ebookTextSource,
    ListenUrlZip,
    audiobookTitle,
    audiobookAuthorFirstName,
    audiobookAuthorLastName,
    audiobookTotalTime,
    audiobookTimeSeconds,
    audiobookCopyrightYear,
    audiobookGenres,
    audiobookReviewUrl,
    audiobookLanguage,
  } = props.route.params;

  const navigation = useNavigation();
  useEffect(() => {
    try {
      navigation.setOptions({ headerTitle: audiobookTitle });
    } catch (err) {
      console.log(err);
    }
  }, [audiobookTitle]);

  function backButtonHandler() {
    console.log("backtest");
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      console.log('Screen is unfocused');
              updateListeningProgress(
                db,
                audiotracksData?.totalAudioBookListeningProgress,
                audiotracksData?.totalAudioBookListeningTimeMS,
                audioBookId
              );
    });

    return unsubscribe;
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button mode={"outlined"} onPress={() => toggleOverlay()}>
          <MaterialIcons
            name="settings"
            size={controlPanelButtonSize}
            color="black"
            style={{
              height: 50,
              backgroundColor: "white",
              borderRadius: 25,
              color: "black",
              margin: 30,
            }}
          />
        </Button>
      ),
      headerLeft: () => (
      backButtonHandler()
      ),
    });
  }, []);

  React.useEffect(() => {
    try {
      getAsyncData("audioModeSettings").then((audioModeSettingsRetrieved) => {
        audioModeSettingsRetrieved;
        if (audioModeSettingsRetrieved) {
          return setAudioModeSettings(audioModeSettingsRetrieved);
        }
      });
      getAsyncData("audioTrackSettingsTest").then(
        (audioTrackSettingsRetrieved) => {
          if (audioTrackSettingsRetrieved) {
            return setAudioPlayerSettings(audioTrackSettingsRetrieved);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const storeAudioTrackSettings = async (settings: object) => {
    await storeAsyncData("audioTrackSettingsTest", settings);
  };

  useEffect(() => {
    try {
      createTablesDB(db);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const updateAudioBookPosition = async (
    audiobook_id: any,
    audiotrack_progress_bars: any,
    current_audiotrack_positions: any
  ) => {
    console.log("updating audiobook position");
    try {
      audiotrack_progress_bars = JSON.stringify(audiotrack_progress_bars);
      current_audiotrack_positions = JSON.stringify(
        current_audiotrack_positions
      );
      updateAudioTrackPositionsDB(
        db,
        audiotrack_progress_bars,
        current_audiotrack_positions,
        audiobook_id
      );
    } catch (err) {
      console.log(err);
    }
  };

  const updateBookShelve = (
    audiobook_id: number | string,
    audiobook_shelved: boolean
  ) => {
    updateBookShelveDB(db, audiobook_id, audiobook_shelved);
  };

  const initialAudioBookStore = (initAudioBookData: any) => {
    initAudioBookData.audiotrack_progress_bars = JSON.stringify(
      initAudioBookData.audiotrack_progress_bars
    );
    initAudioBookData.current_audiotrack_positions = JSON.stringify(
      initAudioBookData.current_audiotrack_positions
    );
    initialAudioBookStoreDB(db, initAudioBookData);
    // initial load of audiotrack data from DB.
    db.transaction((tx) => {
      try {
        tx.executeSql("select * from testaudio15", [], (_, { rows }) => {
          rows["_array"].forEach((element) => {
            if (initAudioBookData.audiobook_id === element.audiobook_id) {
              const initialValue = 0;
              const currentTimeReadInBook = JSON.parse(
                element?.current_audiotrack_positions
              ).reduce(
                (previousValue: any, currentValue: any) =>
                  previousValue + Number(currentValue),
                initialValue
              );
              const currentListeningProgress =
                currentTimeReadInBook / 1000 / audiobookTimeSeconds;

              setAudiotracksData({
                ...audiotracksData,
                linearProgessBars: JSON.parse(
                  element?.audiotrack_progress_bars
                ),
                currentAudiotrackPositionsMs: JSON.parse(
                  element?.current_audiotrack_positions
                ),
                shelveIconToggle: element?.audiobook_shelved,
                audiobookRating: element?.audiobook_rating,
                totalAudioBookListeningTimeMS: currentTimeReadInBook,
                totalAudioBookListeningProgress: currentListeningProgress,
              });
              setBookAmountRead(
                currentTimeReadInBook / 1000 / audiobookTimeSeconds
              );
              console.log(currentListeningProgress, currentTimeReadInBook);
              updateListeningProgress(
                db,
                currentListeningProgress,
                currentTimeReadInBook,
                audioBookId
              );
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }, null);
  };

  const shelveAudiobook = (bookBeingShelved: any) => {
    bookBeingShelved.audiobook_genres = JSON.stringify(
      bookBeingShelved.audiobook_genres
    );
    bookBeingShelved.audiobook_total_time_secs = JSON.stringify(
      bookBeingShelved.audiobook_total_time_secs
    );
    bookBeingShelved.audiobook_total_time = JSON.stringify(
      bookBeingShelved.audiobook_total_time
    );
    shelveAudiobookDB(db, bookBeingShelved);
  };
  const removeShelvedAudiobook = (audiobook_id: number) => {
    removeShelvedAudiobookDB(db, audiobook_id);
  };

  useEffect(() => {
    async function setAudioMode() {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: audioModeSettings.staysActiveInBackground,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: audioModeSettings.shouldDuckAndroid,
          playThroughEarpieceAndroid:
            audioModeSettings.playThroughEarpieceAndroid,
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
        });
      } catch (e) {
        console.log(e);
      }
    }
    setAudioMode();
  }, [audioModeSettings]);
  const sound = React.useRef(new Audio.Sound());

  useEffect(() => {
    fetch(audioBooksRSSLinkToAudioTracks)
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        if (rss?.description !== undefined) {
          setAudioBookDescription(rss?.description);
        }
        if (rss?.items !== undefined) {
          // console.log(rss)
          setDataRSS(rss?.items);
        }
      })
      .catch((error) => console.log("Error: ", error))
      .finally(() => {
        setLoadingAudioListeningLinks(false);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://librivox.org/api/feed/audiobooks/?id=${audioBookId}&fields={sections}&extended=1&format=json`
    )
      .then((response) => response.json())
      .then((json) => {
        return setChapters(json?.books?.[0]?.sections);
      })
      .catch((error) => console.log("Error: ", error))
      .finally(() => setLoadingAudioBookData(false));
  }, []);

  useEffect(() => {
    fetch(audiobookReviewUrl)
      .then((response) => response.json())
      .then((json) => {
        if (json?.result !== undefined) {
          setAudiobookReviews(json.result);
        }
      })
      .catch((error) => console.log("Error: ", error));
  }, [audiobookReviewUrl]);

  useEffect(() => {
    try {
      if (reviews.length > 0 && reviews) {
        const initialValue = 0;
        let starsFromReviews = reviews?.map((review: any) =>
          Number(review?.stars)
        );
        const sumOfStarsFromReviews = starsFromReviews?.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          initialValue
        );
        let averageAudiobookRating = 0;
        if (reviews.length == 1) {
          averageAudiobookRating = sumOfStarsFromReviews;
        } else {
          averageAudiobookRating =
            sumOfStarsFromReviews / starsFromReviews.length;
        }
        setAudiotracksData({
          ...audiotracksData,
          audiobookRating: averageAudiobookRating,
        });
        updateRatingForHistory(db, audioBookId, averageAudiobookRating);
      }
    } catch (e) {
      console.log(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      let initialAudioBookSections = new Array(numberBookSections).fill(0);
      setAudiotracksData({
        ...audiotracksData,
        linearProgessBars: initialAudioBookSections,
        currentAudiotrackPositionsMs: initialAudioBookSections,
      });
      // will only happen if no entry in db already.

      initialAudioBookStore({
        audiobook_id: audioBookId,
        audiotrack_progress_bars: initialAudioBookSections,
        current_audiotrack_positions: initialAudioBookSections,
        audiobook_shelved: audiotracksData.shelveIconToggle,
        audiotrack_rating: audiotracksData.audiobookRating,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      return sound
        ? () => {
            console.log("Unloading Sound");
            sound.current.unloadAsync();
            const initialValue = 0;
            const currentTimeReadInBook =
              audiotracksData.currentAudiotrackPositionsMs.reduce(
                (previousValue: any, currentValue: any) =>
                  previousValue + Number(currentValue),
                initialValue
              );
            const currentListeningProgress =
              currentTimeReadInBook / 1000 / audiobookTimeSeconds;
            console.log(currentListeningProgress, currentTimeReadInBook);
            updateListeningProgress(
              db,
              currentListeningProgress,
              currentTimeReadInBook,
              audioBookId
            );
          }
        : undefined;
    } catch (err) {
      console.log(err);
    }
  }, [sound.current]);

  function sliderPositionCalculation(progress: number) {
    let sliderPositionCalculate = progress * 100;
    return sliderPositionCalculate;
  }
  async function updateLinearProgressBars(progress: number) {
    let updatedLinearProgessBarPositions = [
      ...audiotracksData.linearProgessBars,
    ];
    updatedLinearProgessBarPositions[currentAudioTrackIndex.current] =
      audiotracksData.linearProgessBars[currentAudioTrackIndex.current] =
        progress;
  }
  async function updateAudiotrackPositions(dataPosition: number) {
    let updatedCurrentAudiotrackPositions = [
      ...audiotracksData.currentAudiotrackPositionsMs,
    ];
    updatedCurrentAudiotrackPositions[currentAudioTrackIndex.current] =
      audiotracksData.currentAudiotrackPositionsMs[
        currentAudioTrackIndex.current
      ] = dataPosition;
  }

  async function updateAndStoreAudiobookPositions(data: any) {
    try {
      const currentAudiotrackProgress =
        data.positionMillis / data.durationMillis;
      updateLinearProgressBars(currentAudiotrackProgress);
      updateAudiotrackPositions(data.positionMillis);

      const sliderPositionCalculated = sliderPositionCalculation(
        currentAudiotrackProgress
      );
      setCurrentSliderPosition(sliderPositionCalculated);
      updateAudioBookPosition(
        audioBookId,
        audiotracksData.linearProgessBars,
        audiotracksData.currentAudiotrackPositionsMs
      );
    } catch (err) {
      console.log(err);
    }
  }

  const UpdateStatus = async (data: any) => {
    try {
      if (data.didJustFinish) {
        updateAndStoreAudiobookPositions(data);
        if (audioPlayerSettings.isLooping === false) {
          return HandleNext();
        }
      } else if (data.positionMillis && data.durationMillis) {
        // console.log(data);
        updateAndStoreAudiobookPositions(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const SeekUpdate = async (data: any) => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded === true) {
        const result = (data / 100) * Duration;
        await sound.current.setPositionAsync(Math.round(result));
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

  const LoadAudio = async (index: number, audiotrackPositions = 0) => {
    currentAudioTrackIndex.current = index;
    setLoadingCurrentAudiotrack(true);
    console.log(index, "Playing");
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync(
          { uri: URLSToPlayAudiotracks[index] },
          {
            progressUpdateIntervalMillis: 1000,
            positionMillis: audiotrackPositions,
            shouldPlay: audioPlayerSettings.shouldPlay,
            rate: audioPlayerSettings.rate,
            shouldCorrectPitch: audioPlayerSettings.shouldCorrectPitch,
            volume: audioPlayerSettings.volume,
            isMuted: audioPlayerSettings.isMuted,
            isLooping: audioPlayerSettings.isLooping,
          },
          true
        );
        if (result.isLoaded === false) {
          setLoadingCurrentAudiotrack(false);
          setLoadedCurrentAudiotrack(false);
        } else {
          setAudioTrackChapterPlayingTitle(
            chapters[index]?.section_number + ". " + chapters[index]?.title
          );
          setAudioTrackReader(chapters[index]?.readers[0]?.display_name);
          // ...long-running synchronous task...
          SetDuration(result?.durationMillis);
          setLoadingCurrentAudiotrack(false);
          setLoadedCurrentAudiotrack(true);
          sound.current.setOnPlaybackStatusUpdate(UpdateStatus);
          await PlayAudio();
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
          await sound.current.playAsync();
          SetPlaying(true);
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const PauseAudio = async () => {
    try {
      setAudioPaused(false);
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          await sound.current.pauseAsync();
          setAudioPaused(true);
          SetPlaying(false);
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const HandleNext = async () => {
    try {
      if (currentAudioTrackIndex.current < URLSToPlayAudiotracks.length - 1) {
        const unloadSound = await sound.current.unloadAsync();
        if (unloadSound.isLoaded === false) {
          currentAudioTrackIndex.current += 1;
          setCurrentSliderPosition(0.0);
          // ResetPlayer();
          await LoadAudio(
            currentAudioTrackIndex.current,
            audiotracksData.currentAudiotrackPositionsMs[
              currentAudioTrackIndex.current
            ]
          );
        }
      } else if (
        currentAudioTrackIndex.current >=
        URLSToPlayAudiotracks.length - 1
      ) {
        const unloadSound = await sound.current.unloadAsync();
        if (unloadSound.isLoaded === false) {
          currentAudioTrackIndex.current = 0;
          setCurrentSliderPosition(0.0);
          await ResetPlayer();
          await LoadAudio(
            currentAudioTrackIndex.current,
            audiotracksData.currentAudiotrackPositionsMs[
              currentAudioTrackIndex.current
            ]
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HandlePrev = async () => {
    try {
      if (currentAudioTrackIndex.current - 1 >= 0) {
        const unloadSound = await sound.current.unloadAsync();
        if (unloadSound.isLoaded === false) {
          await LoadAudio(
            currentAudioTrackIndex.current - 1,
            audiotracksData.currentAudiotrackPositionsMs[
              currentAudioTrackIndex.current - 1
            ]
          );
          currentAudioTrackIndex.current -= 1;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetDurationFormat = (duration: number) => {
    try {
      if (typeof duration === "number") {
        const time = duration / 1000;
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        const secondsFormatted = seconds > 9 ? seconds : `0${seconds}`;
        return `${minutes}:${secondsFormatted}`;
      } else {
        return `00:00`;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const FormatChapterDurations = (chapterTimeInSeconds: number) => {
    try {
      if (chapterTimeInSeconds !== undefined) {
        if (chapterTimeInSeconds < 3600) {
          return new Date(chapterTimeInSeconds * 1000)
            .toISOString()
            .substr(14, 5);
        } else {
          return new Date(chapterTimeInSeconds * 1000)
            .toISOString()
            .substr(11, 8);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const PlayFromListenButton = async (index: number) => {
    try {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        setCurrentSliderPosition(0.0);
        await ResetPlayer();
        await LoadAudio(
          index,
          audiotracksData.currentAudiotrackPositionsMs[index]
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderAudiotracks = ({ item, index }: any) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>
          {item?.section_number}: {item?.title}
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text numberOfLines={1} ellipsizeMode="tail">
            Playtime:{" "}
            {GetDurationFormat(
              audiotracksData.currentAudiotrackPositionsMs[index]
            )}
            {" | "}
            {FormatChapterDurations(chapters[index]?.playtime)}
          </Text>
        </ListItem.Subtitle>
        <LinearProgress
          color="primary"
          value={audiotracksData.linearProgessBars[index]}
          variant="determinate"
          trackColor="lightblue"
          width={190}
          animation={false}
        />
        <ListItem.Subtitle>
          <Text numberOfLines={1} ellipsizeMode="tail">
            Reader: {item?.readers[0]?.display_name}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
      <Button
        mode="outlined"
        onPress={() => {
          PlayFromListenButton(index);
        }}
      >
        <MaterialCommunityIcons name="book-play" size={40} color="black" />
      </Button>
    </ListItem>
  );

  const renderReviews = ({ item, index }: any) => (
    <Card>
      <ListItem.Title>{item?.reviewtitle}</ListItem.Title>
      <Card.Divider />
      <Rating
        imageSize={20}
        ratingCount={5}
        startingValue={item?.stars}
        showRating={false}
        readonly={true}
      />
      <ListItem>
        <ListItem.Subtitle>{item?.reviewbody}</ListItem.Subtitle>
      </ListItem>

      <View style={styles.reviewFooter}>
        <ListItem>
          <ListItem.Subtitle>By: {item?.reviewer}</ListItem.Subtitle>
        </ListItem>
        <ListItem>
          <ListItem.Subtitle>{item?.reviewdate}</ListItem.Subtitle>
        </ListItem>
      </View>
    </Card>
  );

  useEffect(() => {
    if (dataRSS.length > 0) {
      // console.log(dataRSS);
      // console.log(dataRSS)
      const RSSDict = Object.entries(dataRSS);
      const RSSURLS = RSSDict.map(([key, value]) => {
        return value?.enclosures[0]?.url;
      });
      setURLSToPlayAudiotracks(RSSURLS);
    }
  }, [dataRSS]);

  function pressedToShelveBook(bookBeingShelved: any) {
    switch (audiotracksData.shelveIconToggle) {
      case 0:
        setAudiotracksData({ ...audiotracksData, shelveIconToggle: 1 });
        shelveAudiobook(bookBeingShelved);
        updateBookShelve(
          bookBeingShelved.audiobook_id,
          !audiotracksData.shelveIconToggle
        );
        break;
      case 1:
        // remove from db
        setAudiotracksData({ ...audiotracksData, shelveIconToggle: 0 });
        updateBookShelve(
          bookBeingShelved.audiobook_id,
          !audiotracksData.shelveIconToggle
        );
        removeShelvedAudiobook(bookBeingShelved.audiobook_id);
        break;
    }
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  if (!loadingAudioListeningLinks && !loadingAudiobookData) {
    const getHeader = () => {
      return (
        <View style={styles.bookHeader}>
          <Card>
            <Card.Title style={styles.bookTitle}> {audiobookTitle}</Card.Title>
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
            <LinearProgress
              color="primary"
              value={audiotracksData?.totalAudioBookListeningProgress}
              variant="determinate"
              trackColor="lightblue"
              width={100}
              animation={false}
            />
            <Text style={styles.bookAuthor}>
              {" "}
              Author: {audiobookAuthorFirstName} {audiobookAuthorLastName}
            </Text>
            <Text style={styles.bookDescription}>{AudioBookDescription}</Text>
            <Rating
              showRating
              ratingCount={5}
              startingValue={audiotracksData.audiobookRating}
              fractions={1}
              readonly={true}
              style={{ paddingVertical: 10 }}
            />
            <View style={styles.shelveButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  pressedToShelveBook({
                    audiobook_rss_url: audioBooksRSSLinkToAudioTracks,
                    audiobook_id: audioBookId,
                    audiobook_image: bookCoverImage,
                    audiobook_title: audiobookTitle,
                    audiobook_author_first_name: audiobookAuthorFirstName,
                    audiobook_author_last_name: audiobookAuthorLastName,
                    audiobook_total_time: audiobookTotalTime,
                    audiobook_total_time_secs: audiobookTimeSeconds,
                    audiobook_copyright_year: audiobookCopyrightYear,
                    audiobook_genres: audiobookGenres,
                    audiobook_rating: audiotracksData.audiobookRating,
                    audiobook_review_url: audiobookReviewUrl,
                    audiobook_num_sections: numberBookSections,
                    audiobook_ebook_url: ebookTextSource,
                    audiobook_zip_file: ListenUrlZip,
                    audiobook_language: audiobookLanguage,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name={
                    audiotracksData.shelveIconToggle ? "book" : "book-outline"
                  }
                  size={50}
                  color={audiotracksData.shelveIconToggle ? "black" : "black"}
                />
              </Button>
            </View>
          </Card>
        </View>
      );
    };

    const audiotracksKeyExtractor = (item: any) => {
      return item?.id;
    };
    const reviewsKeyExtractor = (item: any) => {
      return item?.createdate;
    };

    const AudioTracksScreenData = [
      {
        title: "Audiotracks",
        renderItem: renderAudiotracks,
        data: chapters,
        keyExtractor: audiotracksKeyExtractor,
      },
      {
        title: "Reviews",
        renderItem: renderReviews,
        data: reviews,
        keyExtractor: reviewsKeyExtractor,
      },
    ];

    return (
      <View style={styles.container}>
        <AudioTrackSettings
          visible={visible}
          toggleOverlay={toggleOverlay}
          audioPlayerSettings={audioPlayerSettings}
          storeAudioTrackSettings={storeAudioTrackSettings}
          setAudioPlayerSettings={setAudioPlayerSettings}
          sound={sound}
        />

        <View style={styles.AudioTracksStyle}>
          <View style={styles.listItemHeaderStyle}>
            <SectionList
              sections={AudioTracksScreenData}
              keyExtractor={({ section: { keyExtractor } }) => {
                keyExtractor;
              }}
              renderItem={({ section: { renderItem } }) => renderItem}
              ListHeaderComponent={getHeader()}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionTitles}>{title}</Text>
              )}
            />
          </View>
        </View>

        <AudiotrackSliderWithCurrentPlaying
          currentSliderPosition={currentSliderPosition}
          SeekUpdate={SeekUpdate}
          GetDurationFormat={GetDurationFormat}
          Duration={Duration}
          bookCoverImage={bookCoverImage}
          audioTrackChapterPlayingTitle={audioTrackChapterPlayingTitle}
          audioTrackReader={audioTrackReader}
        />

        <AudioTrackControls
          HandlePrev={HandlePrev}
          HandleNext={HandleNext}
          LoadAudio={LoadAudio}
          PlayAudio={PlayAudio}
          Playing={Playing}
          PauseAudio={PauseAudio}
          audioPaused={audioPaused}
          loadingCurrentAudiotrack={loadingCurrentAudiotrack}
          loadedCurrentAudiotrack={loadedCurrentAudiotrack}
          currentAudioTrackIndex={currentAudioTrackIndex}
        ></AudioTrackControls>
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
    backgroundColor: "black",
    padding: 10,
    paddingTop: 2,
  },
  AudioTracksStyle: {
    flex: 7,
    paddingBottom: 2,
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
    paddingBottom: 0,
    padding: 2,
  },
  shelveButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  reviewFooter: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sectionTitles: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    color: "white",
    fontSize: 16,
  },
});

export default Audiotracks;
