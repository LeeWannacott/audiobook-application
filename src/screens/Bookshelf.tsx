import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { ListItem } from "react-native-elements";
import { Rating } from "react-native-ratings";
import {
  FlatList,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import AudiobookAccordionList from "../components/audiobookAccordionList";

import { audiobookShelfTableName } from "../database_functions";
import { openDatabase } from "../utils";

const db = openDatabase();

function Bookshelf() {
  const [shelvedHistory, setShelvedHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [avatarOnPressEnabled, setAvatarOnPressEnabled] = useState(true);

  function getShelvedBooks() {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${audiobookShelfTableName}`,
        [],
        (_, { rows }) => {
          setShelvedHistory(rows["_array"]);
          setLoadingHistory(false);
        }
      );
    }, null);
  }

  useEffect(() => {
    getShelvedBooks();
  }, []);

  const waitForRefresh = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  function refreshBookshelveOnPull() {
    setIsRefreshing(true);
    getShelvedBooks();
    waitForRefresh(2000).then(() => setIsRefreshing(false));
  }

  const keyExtractor = (item: any, index: number) =>
    item.audiobook_id.toString();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const resizeCoverImageHeight = windowHeight / 5;
  const resizeCoverImageWidth = windowWidth / 2 - 42;
  const navigation = useNavigation();
  const renderBookshelve = ({ item, index }: any) => (
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
                  audioBookId: item?.audiobook_id,
                  urlRss: item?.audiobook_rss_url,
                  coverImage: item?.audiobook_image,
                  title: item?.audiobook_title,
                  authorFirstName: item?.audiobook_author_first_name,
                  authorLastName: item?.audiobook_author_last_name,
                  totalTime: item?.audiobook_total_time,
                  totalTimeSecs: item?.audiobook_total_time_secs,
                  copyrightYear: item?.audiobook_copyright_year,
                  genres: JSON.parse(item?.audiobook_genres),
                  language: item?.audiobook_language,
                  urlReview: item?.audiobook_review_url,
                  numSections: item?.audiobook_num_sections,
                  urlTextSource: item.audiobook_ebook_url,
                  urlZipFile: item.audiobook_zip,
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
