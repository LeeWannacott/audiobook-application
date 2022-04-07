import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  InteractionManager,
  ScrollView,
} from "react-native";
import {
  ListItem,
  LinearProgress,
  Image,
  Card,
  Rating,
  Overlay,
} from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, FlatList, SectionList } from "react-native";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

import { Button, List, Switch, Colors } from "react-native-paper";

import { openDatabase } from "../utils";

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

function Audiotracks(props) {
  const [chapters, setChapters] = useState([]);
  const [dataRSS, setDataRSS] = useState([]);
  const [URLSToPlayAudiotracks, setURLSToPlayAudiotracks] = useState([]);
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
  const [volume, setVolume] = useState(1.0);
  const [Playing, SetPlaying] = useState(false);
  const [Duration, SetDuration] = useState(0);
  const [audioTrackChapterPlayingTitle, setAudioTrackChapterPlayingTitle] =
    useState("");
  const [audioTrackReader, setAudioTrackReader] = useState("");
  const [currentSliderPosition, setCurrentSliderPosition] = React.useState(0);

  const [linearProgessBars, setlinearProgressBars] = useState([]);
  const [currentAudiotrackPositionsMs, setCurrentAudiotrackPositionsMs] =
    useState([]);
  const [shelveIconToggle, setShelveIconToggle] = useState(0);
  const [audiobookRating, setAudiobookRating] = useState(0);
  const [audiotrackAccordionExpanded, setAudiotrackAccordionsExpanded] =
    useState(true);
  const [reviewsAccordionExpanded, setReviewsAccordionsExpanded] =
    useState(true);
  const [controlPanelButtonSize] = useState(30);
  const [visible, setVisible] = useState(false);
  const [isPitchCorrect, setIsPitchCorrect] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [speedOfAudiotrack, setSpeedOfAudiotrack] = useState(1);
  const [looping, setIsLooping] = useState(false);
  // const [pitchCorrection, setPitchCorrection] = useState(true);

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

  useEffect(() => {
    try {
      createTablesDB(db);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const updateAudioBookPosition = async (
    audiobook_id,
    audiotrack_progress_bars,
    current_audiotrack_positions
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

  const updateBookShelve = (audiobook_id, audiobook_shelved) => {
    console.log("updating audiobook position", audiobook_shelved);
    console.log("audiobook shelve value", audiobook_shelved);
    updateBookShelveDB(db, audiobook_id, audiobook_shelved);
  };

  const initialAudioBookStore = (initAudioBookData) => {
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
              let audiobook_positions_temp = JSON.parse(
                element?.audiotrack_progress_bars
              );
              let audiotrack_positionsMS = JSON.parse(
                element?.current_audiotrack_positions
              );
              setlinearProgressBars(audiobook_positions_temp);
              setCurrentAudiotrackPositionsMs(audiotrack_positionsMS);
              setShelveIconToggle(element?.audiobook_shelved);
              setAudiobookRating(element?.audiobook_rating);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }, null);
  };

  const shelveAudiobook = (bookBeingShelved) => {
    bookBeingShelved.audiobook_genres = JSON.stringify(
      bookBeingShelved.audiobook_genres
    );
    shelveAudiobookDB(db, bookBeingShelved);
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
        let starsFromReviews = reviews?.map((review) => Number(review.stars));
        const sumOfStarsFromReviews = starsFromReviews?.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          initialValue
        );
        const averageAudiobookRating =
          sumOfStarsFromReviews / starsFromReviews.length;
        setAudiobookRating(averageAudiobookRating);
        updateRatingForHistory(db, audioBookId, averageAudiobookRating);
      }
    } catch (e) {
      console.log(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      let initialAudioBookSections = new Array(numberBookSections).fill(0);
      setlinearProgressBars(initialAudioBookSections);
      setCurrentAudiotrackPositionsMs(initialAudioBookSections);
      // will only happen if no entry in db already.

      initialAudioBookStore({
        audiobook_id: audioBookId,
        audiotrack_progress_bars: initialAudioBookSections,
        current_audiotrack_positions: initialAudioBookSections,
        audiobook_shelved: shelveIconToggle,
        audiotrack_rating: audiobookRating,
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

  function sliderPositionCalculation(progress) {
    let sliderPositionCalculate = progress * 100;
    return sliderPositionCalculate;
  }
  async function updateLinearProgressBars(progress) {
    let updatedLinearProgessBarPositions = [...linearProgessBars];
    updatedLinearProgessBarPositions[currentAudioTrackIndex.current] =
      linearProgessBars[currentAudioTrackIndex.current] = progress;
  }
  async function updateAudiotrackPositions(dataPosition) {
    let updatedCurrentAudiotrackPositions = [...currentAudiotrackPositionsMs];
    updatedCurrentAudiotrackPositions[currentAudioTrackIndex.current] =
      currentAudiotrackPositionsMs[currentAudioTrackIndex.current] =
        dataPosition;
  }

  async function updateAndStoreAudiobookPositions(data) {
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
        linearProgessBars,
        currentAudiotrackPositionsMs
      );
    } catch (err) {
      console.log(err);
    }
  }

  const UpdateStatus = async (data) => {
    try {
      if (data.didJustFinish) {
        updateAndStoreAudiobookPositions(data);
        console.log("testingloop", looping);
        if (looping === false) {
          return HandleNext(currentAudioTrackIndex.current);
        }
      } else if (data.positionMillis && data.durationMillis) {
        console.log(data);
        updateAndStoreAudiobookPositions(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const SeekUpdate = async (data) => {
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

  const LoadAudio = async (index, audiotrackPositions = 0) => {
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
            shouldPlay: false,
            rate: speedOfAudiotrack,
            shouldCorrectPitch: isPitchCorrect,
            volume: volume,
            isMuted: isMute,
            isLooping: looping,
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
          setCurrentSliderPosition(0);
          // ResetPlayer();
          await LoadAudio(
            currentAudioTrackIndex.current,
            currentAudiotrackPositionsMs[currentAudioTrackIndex.current]
          );
        }
      } else if (
        currentAudioTrackIndex.current >=
        URLSToPlayAudiotracks.length - 1
      ) {
        const unloadSound = await sound.current.unloadAsync();
        if (unloadSound.isLoaded === false) {
          currentAudioTrackIndex.current = 0;
          setCurrentSliderPosition(0);
          await ResetPlayer();
          await LoadAudio(
            currentAudioTrackIndex.current,
            currentAudiotrackPositionsMs[currentAudioTrackIndex.current]
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
            currentAudiotrackPositionsMs[currentAudioTrackIndex.current - 1]
          );
          currentAudioTrackIndex.current -= 1;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetDurationFormat = (duration) => {
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

  const FormatChapterDurations = (chapterTimeInSeconds) => {
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

  const PlayFromListenButton = async (index) => {
    try {
      const unloadSound = await sound.current.unloadAsync();
      if (unloadSound.isLoaded === false) {
        setCurrentSliderPosition(0);
        await ResetPlayer();
        await LoadAudio(index, currentAudiotrackPositionsMs[index]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderAudiotracks = ({ item, index }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>
          {item?.section_number}: {item?.title}
        </ListItem.Title>
        <ListItem.Subtitle>
          <Text numberOfLines={1} ellipsizeMode="tail">
            Playtime: {GetDurationFormat(currentAudiotrackPositionsMs[index])}
            {" | "}
            {FormatChapterDurations(chapters[index]?.playtime)}
          </Text>
        </ListItem.Subtitle>
        <LinearProgress
          color="primary"
          value={linearProgessBars[index]}
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
        <MaterialIconCommunity name="book-play" size={40} color="#841584" />
      </Button>
    </ListItem>
  );

  const renderReviews = ({ item, index }) => (
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
      const dataRSSDict = Object.entries(dataRSS);
      const listRSSURLSTemp = dataRSSDict.map(([key, value]) => {
        return value?.enclosures[0]?.url;
      });
      setURLSToPlayAudiotracks(listRSSURLSTemp);
    }
  }, [dataRSS]);

  function pressedToShelveBook(bookBeingShelved) {
    switch (shelveIconToggle) {
      case 0:
        setShelveIconToggle(1);
        shelveAudiobook(bookBeingShelved);
        updateBookShelve(bookBeingShelved.audiobook_id, !shelveIconToggle);
        break;
      case 1:
        // remove from db
        setShelveIconToggle(0);
        updateBookShelve(bookBeingShelved.audiobook_id, !shelveIconToggle);
        removeShelvedAudiobook(bookBeingShelved.audiobook_id);
        break;
    }
  }

  function handleAudiobookAccordionPress() {
    setAudiotrackAccordionsExpanded(!audiotrackAccordionExpanded);
  }
  function handleReviewsAccordionPress() {
    setReviewsAccordionsExpanded(!reviewsAccordionExpanded);
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function onTogglePitchSwitch(value) {
    try {
      const result = await sound.current.getStatusAsync();
      setIsPitchCorrect(!isPitchCorrect);
      if (value) {
        if (result.isLoaded === true) {
          await sound.current.setRateAsync(speedOfAudiotrack, true);
        }
      } else if (!value) {
        if (result.isLoaded === true) {
          await sound.current.setRateAsync(speedOfAudiotrack, false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function onToggleMuteSwitch(value) {
    try {
      const result = await sound.current.getStatusAsync();
      setIsMute(!isMute);
      if (value) {
        if (result.isLoaded === true) {
          await sound.current.setIsMutedAsync(true);
        }
      } else if (!value) {
        if (result.isLoaded === true) {
          await sound.current.setIsMutedAsync(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function onToggleLoopSwitch(value) {
    try {
      const result = await sound.current.getStatusAsync();
      setIsLooping(!looping);
      if (value) {
        if (result.isLoaded === true) {
          await sound.current.setIsLoopingAsync(true);
        }
      } else if (!value) {
        if (result.isLoaded === true) {
          await sound.current.setIsLoopingAsync(false);
        }
      }
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
              startingValue={audiobookRating}
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
                    audiobook_rating: audiobookRating,
                    audiobook_review_url: audiobookReviewUrl,
                    audiobook_num_sections: numberBookSections,
                    audiobook_ebook_url: ebookTextSource,
                    audiobook_zip_file: ListenUrlZip,
                    audiobook_language: audiobookLanguage,
                  });
                }}
              >
                <MaterialIconCommunity
                  name={shelveIconToggle ? "book" : "book-outline"}
                  size={50}
                  color={shelveIconToggle ? "black" : "black"}
                  onPress={() => {
                    // navigation.navigate("Home", []);
                  }}
                />
              </Button>
            </View>
          </Card>
        </View>
      );
    };

    const audiotracksKeyExtractor = (item) => {
      return item?.id;
    };
    const reviewsKeyExtractor = (item) => {
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
          <Text>Speed of Audiotrack: {speedOfAudiotrack}</Text>
          <Slider
            value={speedOfAudiotrack}
            style={{ width: 200, height: 40 }}
            minimumValue={0.5}
            maximumValue={2.5}
            minimumTrackTintColor="green"
            maximumTrackTintColor="grey"
            step={0.25}
            onValueChange={async (speed) => {
              try {
                setSpeedOfAudiotrack(speed);
                const result = await sound.current.getStatusAsync();
                if (result.isLoaded === true) {
                  await sound.current.setRateAsync(speed, isPitchCorrect);
                }
              } catch (e) {
                console.log(e);
              }
            }}
          />
          <Text>Pitch Correction: {isPitchCorrect}</Text>
          <Switch value={isPitchCorrect} onValueChange={onTogglePitchSwitch} />
          <Text>Mute: {isPitchCorrect}</Text>
          <Switch value={isMute} onValueChange={onToggleMuteSwitch} />

          <Text>looping: {looping}</Text>
          <Switch value={looping} onValueChange={onToggleLoopSwitch} />

          <Text>Volume of Audiotrack: {volume}</Text>
          <Slider
            value={volume}
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="green"
            maximumTrackTintColor="grey"
            step={0.25}
            onValueChange={async (volumeLevel) => {
              try {
                const result = await sound.current.getStatusAsync();
                setVolume(volumeLevel);
                if (result.isLoaded === true) {
                  await sound.current.setVolumeAsync(volumeLevel);
                }
              } catch (e) {
                console.log(e);
              }
            }}
          />
        </Overlay>
        <View style={styles.AudioTracksStyle}>
          <View style={styles.listItemHeaderStyle}>
            <View style={styles.AudioTracksStyle}></View>
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
            <Button mode="outlined" onPress={toggleOverlay} size={20}>
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
    color: "red",
    fontSize: 16,
  },
  sectionTitlesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default Audiotracks;
