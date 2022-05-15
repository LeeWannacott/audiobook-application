import React from "react";
import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { ListItem, LinearProgress } from "react-native-elements";
import { Rating } from "react-native-ratings";
import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import AudiobookAccordionList from "../components/audiobookAccordionList";

import { Picker } from "@react-native-picker/picker";

import { openDatabase, roundNumberTwoDecimal } from "../utils";
import {
  audiobookHistoryTableName,
  audiobookProgressTableName,
  getAsyncData,
  storeAsyncData,
} from "../database_functions";

const db = openDatabase();

// global scope
let lolcache = {};

function History() {
  const [audiobookHistory, setAudiobookHistory] = useState<any[]>([]);
  const [audioBookInfo, setAudioBookInfo] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [avatarOnPressEnabled, setAvatarOnPressEnabled] = useState(true);

  const [pickerAndQueryState, setPickerAndQueryState] = useState<any>({
    toggle: 0,
    order: "ASC",
    orderBy: "order by id",
    icon: "sort-ascending",
    pickerIndex: 0,
  });

  function toggleAscOrDescSort() {
    if (pickerAndQueryState.toggle == 0) {
      setPickerAndQueryState({
        ...pickerAndQueryState,
        toggle: 1,
        order: "DESC",
        icon: "sort-descending",
      });
      getShelvedBooks({
        ...pickerAndQueryState,
        toggle: 1,
        order: "DESC",
        icon: "sort-descending",
      });
      storeAsyncData("pickerAndQueryData", {
        ...pickerAndQueryState,
        toggle: 1,
        order: "DESC",
        icon: "sort-descending",
      });
    } else {
      setPickerAndQueryState({
        ...pickerAndQueryState,
        toggle: 0,
        order: "ASC",
        icon: "sort-ascending",
      });
      getShelvedBooks({
        ...pickerAndQueryState,
        toggle: 0,
        order: "ASC",
        icon: "sort-ascending",
      });
      storeAsyncData("pickerAndQueryData", {
        ...pickerAndQueryState,
        toggle: 0,
        order: "ASC",
        icon: "sort-ascending",
      });
    }
  }

  React.useEffect(() => {
    try {
      getAsyncData("pickerAndQueryData").then((pickerAndQueryDataRetrieved) => {
        if (pickerAndQueryDataRetrieved) {
          getShelvedBooks(pickerAndQueryDataRetrieved);
          return setPickerAndQueryState(pickerAndQueryDataRetrieved);
        } else {
          getShelvedBooks(pickerAndQueryState);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${audiobookProgressTableName}`,
        [],
        (_, { rows }) => {
          const audioProgressData = {};
          rows._array.forEach((row) => {
            return (audioProgressData[row.audiobook_id] = row);
          });
          setAudioBookInfo(audioProgressData);
        }
      );
    }, null);
  }, []);

  function getShelvedBooks(pickerAndQueryStatePassedIn: {
    orderBy: string;
    order: string;
  }) {
    console.log(pickerAndQueryStatePassedIn);

    let test = `select * from ${audiobookHistoryTableName} inner join ${audiobookProgressTableName} on ${audiobookProgressTableName}.audiobook_id = ${audiobookHistoryTableName}.audiobook_id ${pickerAndQueryStatePassedIn.orderBy} ${pickerAndQueryStatePassedIn.order} limit 100`;
    console.log(test);

    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${audiobookHistoryTableName} inner join ${audiobookProgressTableName} on ${audiobookProgressTableName}.audiobook_id = ${audiobookHistoryTableName}.audiobook_id ${pickerAndQueryStatePassedIn.orderBy} ${pickerAndQueryStatePassedIn.order} limit 100`,
        [],
        (_, { rows }) => {
          let start = performance.now();
          let newHistory = [];
          for (let row of rows._array) {
            if (
              Object.prototype.hasOwnProperty.call(lolcache, row.audiobook_id)
            ) {
              newHistory.push(lolcache[row.audiobook_id]);
            } else {
              lolcache[row.audiobook_id] = row;
              newHistory.push(row);
            }
          }
          setAudiobookHistory(newHistory);
          // setAudiobookHistory(rows["_array"]);
          // console.log(rows["_array"]);
          let end = performance.now();
          console.log("time: ", end - start);
          setLoadingHistory(false);
        }
      );
    }, null);
  }

  const keyExtractor = (item, index) => item.audiobook_id.toString();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  {
  }
  const resizeCoverImageHeight = windowHeight / 5;
  const resizeCoverImageWidth = windowWidth / 2 - 42;

  function selectAccordionPickerTitle(pickerIndex, item) {
    switch (pickerIndex) {
      case 0:
        return item?.id;
      case 1:
        return item?.audiobook_title;
      case 2:
        return audioBookInfo[item?.audiobook_id]?.audiobook_rating;
      case 3:
        return item?.audiobook_total_time;
      case 4:
        return item?.audiobook_author_last_name;
      case 5:
        return item?.audiobook_author_first_name;
      case 6:
        return item?.audiobook_language;
      case 7:
        return JSON.parse(item.audiobook_genres)[0].name;
      case 8:
        return item?.audiobook_copyright_year;
      case 9:
        return (
          roundNumberTwoDecimal(
            audioBookInfo[item?.audiobook_id]?.listening_progress_percent * 100
          ) + "%"
        );
    }
  }

  const renderItem = ({ item, index }: any) => (
    <View>
      <ListItem topDivider containerStyle={styles.AudioBookListView}>
        <View style={styles.ImageContainer}>
          <Pressable
            onPress={() => {
              if (avatarOnPressEnabled) {
                navigation.navigate("Audio", {
                  audioBooksRSSLinkToAudioTracks: item?.audiobook_rss_url,
                  audioBookId: item?.audiobook_id,
                  bookCoverImage: item?.audiobook_image,
                  audiobookTitle: item?.audiobook_title,
                  audiobookAuthorFirstName: item?.audiobook_author_first_name,
                  audiobookAuthorLastName: item?.audiobook_author_last_name,
                  audiobookTotalTime: item?.audiobook_total_time,
                  audiobookTimeSeconds: item?.audiobook_total_time_secs,
                  audiobookCopyrightYear: item?.audiobook_copyright_year,
                  audiobookGenres: JSON.parse(item?.audiobook_genres),
                  audiobookLanguage: item?.audiobook_language,
                  audiobookRating:
                    audioBookInfo[item?.audiobook_id]?.audiobook_rating,
                  audiobookReviewUrl: item?.audiobook_review_url,
                  numberBookSections: item?.audiobook_num_sections,
                  // ebookTextSource: item.audiobook_ebook_url,
                  // ListenUrlZip: item.audiobook_zip_file,
                });
              }
              setAvatarOnPressEnabled(false);
              setTimeout(() => {
                setAvatarOnPressEnabled(true);
              }, 2000);
            }}
          >
            <Image
              source={{ uri: item.audiobook_image }}
              style={{
                width: resizeCoverImageWidth,
                height: resizeCoverImageHeight,
              }}
            />
          </Pressable>

          {audioBookInfo[item.audiobook_id]?.audiobook_id ==
          item.audiobook_id ? (
            <LinearProgress
              color="darkgreen"
              value={
                audioBookInfo[item.audiobook_id]?.listening_progress_percent
              }
              variant="determinate"
              trackColor="white"
              animation={false}
            />
          ) : (
            <LinearProgress
              color="primary"
              variant="determinate"
              trackColor="white"
              animation={false}
            />
          )}
        </View>
      </ListItem>
      {audioBookInfo[item.audiobook_id]?.audiobook_id == item.audiobook_id &&
      audioBookInfo[item.audiobook_id]?.audiobook_rating > 0 ? (
        <Rating
          showRating={false}
          imageSize={20}
          ratingCount={5}
          startingValue={audioBookInfo[item.audiobook_id]?.audiobook_rating}
          readonly={true}
          tintColor={"black"}
        />
      ) : undefined}
      <AudiobookAccordionList
        accordionTitle={selectAccordionPickerTitle(
          pickerAndQueryState.pickerIndex,
          item
        )}
        audiobookTitle={item?.audiobook_title}
        audiobookAuthorFirstName={item?.audiobook_author_first_name}
        audiobookAuthorLastName={item?.audiobook_author_last_name}
        audiobookTotalTime={item?.audiobook_total_time}
        audiobookCopyrightYear={item?.audiobook_copyright_year}
        audiobookGenres={item?.audiobook_genres}
        audiobookLanguage={item?.audiobook_language}
      />
    </View>
  );

  if (!loadingHistory) {
    return (
      <View>
        <View style={styles.flatListStyle}>
          <View style={styles.SQLQueryPickerAndIcon}>
            <View style={styles.SQLQueryPicker}>
              <Picker
                selectedValue={pickerAndQueryState.orderBy}
                mode={"dropdown"}
                dropdownIconRippleColor={"grey"}
                onValueChange={(itemValue, itemPosition) => {
                  setPickerAndQueryState({
                    ...pickerAndQueryState,
                    orderBy: itemValue,
                    pickerIndex: itemPosition,
                  });
                  getShelvedBooks({
                    ...pickerAndQueryState,
                    orderBy: itemValue,
                    pickerIndex: itemPosition,
                  });
                  storeAsyncData("pickerAndQueryData", {
                    ...pickerAndQueryState,
                    orderBy: itemValue,
                    pickerIndex: itemPosition,
                  });
                }}
              >
                <Picker.Item label="Order Visited" value="order by id" />
                <Picker.Item label="Title" value="order by audiobook_title" />
                <Picker.Item label="Rating" value="order by audiobook_rating" />
                <Picker.Item
                  label="Total Time"
                  value="order by audiobook_total_time"
                />
                <Picker.Item
                  label="Author Last Name"
                  value="order by audiobook_author_last_name"
                />
                <Picker.Item
                  label="Author First Name"
                  value="order by audiobook_author_first_name"
                />
                <Picker.Item
                  label="Language"
                  value="order by audiobook_language"
                />
                <Picker.Item label="Genre" value="order by audiobook_genres" />
                <Picker.Item
                  label="Copyright year"
                  value="order by audiobook_copyright_year"
                />
                <Picker.Item
                  label="Listening Progress"
                  value="order by listening_progress_percent"
                />
              </Picker>
            </View>
            <Button
              mode="contained"
              style={{
                backgroundColor: "black",
                height: 62,
                marginTop: 5,
                marginBottom: 5,
              }}
              onPress={() => {
                toggleAscOrDescSort();
              }}
            >
              <MaterialIconCommunity
                name={pickerAndQueryState.icon}
                size={40}
                color="white"
              />
            </Button>
          </View>
          <FlatList
            data={audiobookHistory}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.ActivityIndicatorStyle}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
}

export default History;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ImageContainerWidth = windowWidth / 2 - 40;

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    width: ImageContainerWidth,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
  },
  flatListStyle: {
    padding: 10,
    paddingTop: 40,
    paddingBottom: 0,
    // bottom: 162,
    height: 681,
    color: "blue",
    backgroundColor: "#331800",
  },
  AudioBookListView: {
    backgroundColor: "#51361a",
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2,
    color: "green",
  },
  SQLQueryPicker: {
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: "white",
    width: windowWidth - 100,
    margin: 5,
    marginLeft: 0,
  },
  SQLQueryPickerAndIcon: {
    display: "flex",
    flexDirection: "row",
  },
});
