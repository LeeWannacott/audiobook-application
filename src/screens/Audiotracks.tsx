import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import {
  ListItem,
  LinearProgress,
  Card,
  Rating,
  Overlay,
} from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, SectionList, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";

import { Button, List, Colors, Switch } from "react-native-paper";

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
    });
  }, []);

  React.useState(() => {
    try {
      getAsyncData("audioTrackSettingsTest").then(
        (audioTrackSettingsRetrieved) => {
          audioTrackSettingsRetrieved
            ? setAudioPlayerSettings(audioTrackSettingsRetrieved)
            : console.log("no settings stored");
        }
      );
      getAsyncData("audioModeSettings").then((audioModeSettings) => {
        audioModeSettings
          ? (setAudioModeSettings(audioModeSettings),
            console.log("yo", audioModeSettings))
          : console.log("no modes");
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const storeAudioTrackSettings = (settings: object) => {
    storeAsyncData("audioTrackSettingsTest", settings);
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
        tx.executeSql("select * from testaudio14", [], (_, { rows }) => {
          rows["_array"].forEach((element) => {
            if (initAudioBookData.audiobook_id === element.audiobook_id) {
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
              });
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
      let currentAudiotrackProgress = data.positionMillis / data.durationMillis;
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
        console.log(data);
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
            progressUpdateIntervalMillis: 5000,
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
      console.log(dataRSS);
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

  async function onTogglePitchSwitch(value: boolean) {
    try {
      const result = await sound.current.getStatusAsync();
      setAudioPlayerSettings({
        ...audioPlayerSettings,
        shouldCorrectPitch: !audioPlayerSettings.shouldCorrectPitch,
      });
      if (value) {
        if (result.isLoaded === true) {
          await sound.current.setRateAsync(audioPlayerSettings.rate, true);
        }
      } else if (!value) {
        if (result.isLoaded === true) {
          await sound.current.setRateAsync(audioPlayerSettings.rate, false);
        }
      }
      storeAudioTrackSettings({
        ...audioPlayerSettings,
        shouldCorrectPitch: !audioPlayerSettings.shouldCorrectPitch,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function onToggleMuteSwitch(value: boolean) {
    try {
      const result = await sound.current.getStatusAsync();
      setAudioPlayerSettings({
        ...audioPlayerSettings,
        isMuted: !audioPlayerSettings.isMuted,
      });
      if (value) {
        if (result.isLoaded === true) {
          await sound.current.setIsMutedAsync(true);
        }
      } else if (!value) {
        if (result.isLoaded === true) {
          await sound.current.setIsMutedAsync(false);
        }
      }
      storeAudioTrackSettings({
        ...audioPlayerSettings,
        isMuted: !audioPlayerSettings.isMuted,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function onToggleLoopSwitch(value: boolean) {
    try {
      const result = await sound.current.getStatusAsync();
      setAudioPlayerSettings({
        ...audioPlayerSettings,
        isLooping: !audioPlayerSettings.isLooping,
      });
      if (value) {
        if (result.isLoaded === true) {
          await sound.current.setIsLoopingAsync(true);
        }
      } else if (!value) {
        if (result.isLoaded === true) {
          await sound.current.setIsLoopingAsync(false);
        }
      }
      storeAudioTrackSettings({
        ...audioPlayerSettings,
        isLooping: !audioPlayerSettings.isLooping,
      });
    } catch (e) {
      console.log(e);
    }
  }

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
        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          fullScreen={false}
        >
          <Text>Volume of Audiotrack: {audioPlayerSettings.volume}</Text>
          <View style={styles.sliderWithIconsOnSides}>
            <MaterialCommunityIcons
              name={"volume-minus"}
              size={30}
              color={"black"}
            />
            <Slider
              value={audioPlayerSettings.volume}
              style={{ width: 200, height: 40 }}
              minimumValue={0.0}
              maximumValue={2.0}
              minimumTrackTintColor="green"
              maximumTrackTintColor="grey"
              step={0.25}
              onValueChange={async (volumeLevel) => {
                try {
                  const result = await sound.current.getStatusAsync();
                  setAudioPlayerSettings({
                    ...audioPlayerSettings,
                    volume: volumeLevel,
                  });
                  if (result.isLoaded === true) {
                    await sound.current.setVolumeAsync(volumeLevel);
                  }
                  storeAudioTrackSettings({
                    ...audioPlayerSettings,
                    volume: volumeLevel,
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            />
            <MaterialCommunityIcons
              name={"volume-plus"}
              size={30}
              color={"black"}
            />
          </View>
          <Text>
            Pitch Correction: {audioPlayerSettings.shouldCorrectPitch}
          </Text>
          <Switch
            value={audioPlayerSettings.shouldCorrectPitch}
            onValueChange={onTogglePitchSwitch}
          />
          <Text>Mute: {audioPlayerSettings.isMuted}</Text>
          <Switch
            value={audioPlayerSettings.isMuted}
            onValueChange={onToggleMuteSwitch}
          />
          <Text>looping: {audioPlayerSettings.isLooping}</Text>
          <Switch
            value={audioPlayerSettings.isLooping}
            onValueChange={onToggleLoopSwitch}
          />
          <Text>Speed of Audiotrack: {audioPlayerSettings.rate}</Text>
          <View style={styles.sliderWithIconsOnSides}>
            <MaterialCommunityIcons
              name={"tortoise"}
              size={30}
              color={"black"}
            />
            <Slider
              value={audioPlayerSettings.rate}
              style={{ width: 200, height: 40 }}
              minimumValue={0.5}
              maximumValue={2.5}
              minimumTrackTintColor="green"
              maximumTrackTintColor="grey"
              step={0.25}
              onValueChange={async (speed) => {
                try {
                  setAudioPlayerSettings({
                    ...audioPlayerSettings,
                    rate: speed,
                  });
                  const result = await sound.current.getStatusAsync();
                  if (result.isLoaded === true) {
                    await sound.current.setRateAsync(
                      speed,
                      audioPlayerSettings.shouldCorrectPitch
                    );
                  }
                  storeAudioTrackSettings({
                    ...audioPlayerSettings,
                    rate: speed,
                  });
                } catch (e) {
                  console.log(e);
                }
              }}
            />
            <MaterialCommunityIcons name={"rabbit"} size={30} color={"black"} />
          </View>
        </Overlay>
        <View style={styles.AudioTracksStyle}>
          <View style={styles.listItemHeaderStyle}>
            <View style={styles.AudioTracksStyle2}></View>
            <SectionList
              sections={AudioTracksScreenData}
              keyExtractor={({ section: { keyExtractor } }) => {
                keyExtractor;
              }}
              renderItem={({ section: { renderItem } }) => renderItem}
              ListHeaderComponent={getHeader()}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionTitlesContainer}>
                  <Text style={styles.sectionTitles}>{title}</Text>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.SliderStyle}>
          <Slider
            value={currentSliderPosition}
            disabled={false}
            minimumValue={0.0}
            maximumValue={100.0}
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
            <Button mode="outlined">
              <MaterialIcons
                name="reply"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
            <Button mode="outlined" onPress={() => HandlePrev()}>
              <MaterialIcons
                name="skip-previous"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>

            {loadingCurrentAudiotrack ? (
              <ActivityIndicator size={"large"} color={"dodgerblue"} />
            ) : loadedCurrentAudiotrack === false ? (
              <Button
                mode="outlined"
                onPress={() => LoadAudio(currentAudioTrackIndex.current)}
              >
                <MaterialIcons
                  name="not-started"
                  size={controlPanelButtonSize}
                  color="black"
                  style={styles.control}
                />
              </Button>
            ) : Playing ? (
              <Button mode="outlined" onPress={() => PauseAudio()}>
                <MaterialIcons
                  name="pause"
                  size={controlPanelButtonSize}
                  color="black"
                  style={styles.control}
                />
              </Button>
            ) : audioPaused === false ? (
              <ActivityIndicator size={"large"} color={"dodgerblue"} />
            ) : (
              <Button mode="outlined" onPress={() => PlayAudio()}>
                <MaterialIcons
                  name="play-arrow"
                  size={controlPanelButtonSize}
                  color="black"
                  style={styles.control}
                />
              </Button>
            )}
            <Button mode="outlined" onPress={() => HandleNext()}>
              <MaterialIcons
                name="skip-next"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
            <Button mode="outlined" onPress={toggleOverlay}>
              <MaterialIcons
                name="list"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
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
    backgroundColor: "black",
    padding: 10,
    paddingTop: 2,
  },
  AudioTracksStyle: {
    flex: 7,
    paddingBottom: 2,
  },
  AudioTracksStyle2: {},
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
    color: "white",
    fontSize: 16,
  },
  sectionTitlesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  sliderWithIconsOnSides: {
    display: "flex",
    flexDirection: "row",
  },
});

export default Audiotracks;
