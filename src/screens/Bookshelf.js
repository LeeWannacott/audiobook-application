import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { ListItem, Rating } from "react-native-elements";
import {
  FlatList,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import AudiobookAccordionList from "../components/audiobookAccordionList.js";

import { openDatabase } from "../utils";

const db = openDatabase();

function Bookshelf() {
  const [shelvedHistory, setShelvedHistory] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [avatarOnPressEnabled, setAvatarOnPressEnabled] = useState(true);

  function getShelvedBooks() {
    db.transaction((tx) => {
      tx.executeSql("select * from testShelve24", [], (_, { rows }) => {
        if (JSON.stringify(shelvedHistory) !== JSON.stringify(rows["_array"])) {
          setShelvedHistory(rows["_array"]);
        }
        setLoadingHistory(false);
      });
    }, null);
  }

  useEffect(() => {
    getShelvedBooks();
  }, []);

const waitForRefresh = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
  function refreshBookshelveOnPull() {
    setIsRefreshing(true);
    getShelvedBooks();
     waitForRefresh(2000).then(() => setIsRefreshing(false));
  }

  const keyExtractor = (item, index) => item.audiobook_id.toString();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const resizeCoverImageHeight = windowHeight / 5;
  const resizeCoverImageWidth = windowWidth / 2 - 42;
  const navigation = useNavigation();
  const renderBookshelve = ({ item, index }) => (

    <View>
      <ListItem topDivider containerStyle={styles.AudioBookListView}>
        <View style={styles.ImageContainer}>
          <Pressable
            android_ripple={{
              color: "#FFF",
              borderless: false,
              foreground: true,
            }}
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
                  audiobookCopyrightYear: item?.audiobook_copyright_year,
                  audiobookGenres: JSON.parse(item?.audiobook_genres),
                  audiobookLanguage: item?.audiobook_language,
                  audiobookRating: item?.audiobook_rating,
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
        </View>
      </ListItem>
      <Rating
        showRating
        imageSize={20}
        ratingCount={5}
        startingValue={item.audiobook_rating}
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
    return (
      <View>
        <View style={styles.audiobookImagesContainer}>
          <FlatList
            data={shelvedHistory}
            keyExtractor={keyExtractor}
            renderItem={renderBookshelve}
            numColumns={2}
            containerStyle={{ bottom: 10 }}
            onRefresh={() => refreshBookshelveOnPull()}
            refreshing={isRefreshing}
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

export default Bookshelf;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    width: windowWidth / 2 - 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
  },
  audiobookImagesContainer: {
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
});
