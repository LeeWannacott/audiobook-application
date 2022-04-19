import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { Avatar, ListItem, Rating } from "react-native-elements";
import { FlatList, ActivityIndicator, Dimensions } from "react-native";
import { List, Divider } from "react-native-paper";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import AudiobookAccordionList from "../components/audiobookAccordionList.js";

import { Picker } from "@react-native-picker/picker";

import { openDatabase } from "../utils";

const db = openDatabase();

function History() {
  const [audiobookHistory, setAudiobookHistory] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderBy, setOrderBy] = useState("");

  function getShelvedBooks() {
    db.transaction((tx) => {
      let start = performance.now();
      tx.executeSql(
        `select * from testHistory14 ${orderBy}`,
        [],
        (_, { rows }) => {
          // if (JSON.stringify(audiobookHistory) !== JSON.stringify(rows["_array"])) {
          setAudiobookHistory(rows["_array"].reverse());
          let end = performance.now();
          console.log("time: ", end - start);
          // }
          setLoadingHistory(false);
        }
      );
    }, null);
  }

  useEffect(() => {
    getShelvedBooks();
  }, []);

  function refreshBookshelveOnPull() {
    setIsRefreshing(true);
    getShelvedBooks();
    setIsRefreshing(false);
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from testHistory14", [], (_, { rows }) => {
        setAudiobookHistory(rows["_array"].reverse());
        setLoadingHistory(false);
      });
    }, null);
  }, []);
  // console.log("Audiobook_History", audiobookHistory);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const keyExtractor = (item, index) => item.audiobook_id.toString();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  {
    // console.log(audiobookHistory[0].audiobook_image);
  }
  let resizeCoverImageHeight = windowHeight / 5;
  let resizeCoverImageWidth = windowWidth / 2 - 42;
  const renderItem = ({ item, index }) => (
    <View>
      <ListItem topDivider containerStyle={styles.AudioBookListView}>
        <View style={styles.ImageContainer}>
          <Avatar
            source={{ uri: item.audiobook_image }}
            style={{
              width: resizeCoverImageWidth,
              height: resizeCoverImageHeight,
            }}
            onPress={() => {
              navigation.navigate("Audio", {
                audioBooksRSSLinkToAudioTracks: item?.audiobook_rss_url,
                audioBookId: item?.audiobook_id,
                bookCoverImage: item?.audiobook_image,
                audiobookTitle: item?.audiobook_title,
                audiobookAuthorFirstName: item?.audiobook_author_first_name,
                audiobookAuthorLastName: item?.audiobook_author_last_name,
                audiobookTotalTime: item?.audiobook_total_time,
                audiobookCopyrightYear: item?.audiobook_copyright_year,
                audiobookGenres: JSON.parse(item?.audiobook_genres),
                audiobookLanguage: item?.audiobook_language,
                audiobookRating: item?.audiobook_rating,
                audiobookReviewUrl: item?.audiobook_review_url,
                numberBookSections: item?.audiobook_num_sections,
                // ebookTextSource: item.audiobook_ebook_url,
                // ListenUrlZip: item.audiobook_zip_file,
              });
            }}
          />
        </View>
      </ListItem>
      <Rating
        showRating
        imageSize={20}
        ratingCount={5}
        startingValue={item?.audiobook_rating}
        showRating={false}
        readonly={true}
        style={{ ratingColor: "red" }}
        tintColor={"black"}
        ratingBackgroundColor={"purple"}
      />
      <AudiobookAccordionList
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
    console.log(audiobookHistory);
    return (
      <View>
        <View style={styles.flatListStyle}>
          <View style={styles.SQLQueryPickerAndIcon}>
          <View style={styles.SQLQueryPicker}>
            <Picker
              selectedValue={orderBy}
              onValueChange={(itemValue, itemIndex) => (
                setOrderBy(itemValue), getShelvedBooks()
              )}
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
            </Picker>
          </View>
          <MaterialIconCommunity name="transfer-down" size={45} color="white" />
          </View>
          <FlatList
            data={audiobookHistory}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            containerStyle={{ bottom: 10 }}
            onRefresh={() => refreshBookshelveOnPull()}
            refreshing={isRefreshing}
            // onEndReached={()=>refreshBookshelveOnPull()}
            // onEndReachedThreshold={0} // handle refresh
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

const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "red",
    width: windowWidth / 2 - 40,
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
    borderColor:"green",
    borderWidth:1,
    borderRadius:2,
    backgroundColor: "white",
    width:windowWidth - 70,
  },
  SQLQueryPickerAndIcon: {
    display: "flex",
    flexDirection: "row",
  },
});
