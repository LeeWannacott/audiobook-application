import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import AudiobookAccordionList from "../components/audiobookAccordionList";

import { openDatabase } from "../utils";
import {
  createHistoryTableDB,
  addAudiobookToHistoryDB,
} from "../database_functions";

const db = openDatabase();

export default function Audiobooks(props: any) {
  const [loadingAudioBooks, setLoadingAudioBooks] = useState(true);
  const [data, setAudiobooks] = useState<any>([]);
  const [bookCovers, setBookCovers] = useState<any[]>([]);
  const [reviewURLS, setReviewsUrlList] = useState<any[]>([]);
  const [avatarOnPressEnabled, setAvatarOnPressEnabled] = useState(true);

  React.useEffect(() => {
    createHistoryTableDB(db);
  }, []);

  const addAudiobookToHistory = (bookDataForHistory: {
    audiobook_genres: string;
  }) => {
    console.log(bookDataForHistory);
    bookDataForHistory.audiobook_genres = JSON.stringify(
      bookDataForHistory.audiobook_genres
    );
    addAudiobookToHistoryDB(db, bookDataForHistory);
  };

  useEffect(() => {
    setLoadingAudioBooks(true);
    const searchQuery = encodeURIComponent(props.searchBarCurrentText);
    const genre = encodeURIComponent(props.apiSettings["audiobookGenre"]);
    const author = encodeURIComponent(props.apiSettings["authorLastName"]);
    const amountOfAudiobooks = encodeURIComponent(
      props.apiSettings["audiobookAmountRequested"]
    );
    const librivoxAudiobooksAPI = encodeURI(
      "https://librivox.org/api/feed/audiobooks"
    );
    const carot = encodeURIComponent("^");
    // fields removed: sections(adds to loading time), description(not url decoded),translators.
    const fields =
      "id,title,url_text_source,language,copyright_year,num_sections,url_rss,url_zip_file,url_project,url_librivox,url_iarchive,url_other,totaltime,totaltimesecs,authors,genres";
    let apiFetchQuery;
    switch (props.apiSettings["searchBy"]) {
      case "recent":
        const twoMonthsAgoInUnixTime =
          (new Date().getTime() - 60 * 24 * 60 * 60 * 1000) / 1000;
        apiFetchQuery = encodeURI(
          `${librivoxAudiobooksAPI}/?since=${twoMonthsAgoInUnixTime}&fields={${fields}}&extended=1&format=json&limit=${amountOfAudiobooks}`
        );
        break;
      case "title":
        apiFetchQuery = encodeURI(
          `${librivoxAudiobooksAPI}/?title=${carot}${searchQuery}&fields={${fields}}&extended=1&format=json&limit=${amountOfAudiobooks}`
        );
        break;
      case "author":
        apiFetchQuery = encodeURI(
          `${librivoxAudiobooksAPI}/?author=${author}&fields={${fields}}&extended=1&format=json&limit=${amountOfAudiobooks}`
        );
        break;
      case "genre":
        apiFetchQuery = encodeURI(
          `${librivoxAudiobooksAPI}/?genre=${genre}&fields={${fields}}&extended=1&format=json&limit=${amountOfAudiobooks}`
        );
        break;
      default:
        break;
    }
    if (props.apiSettings["searchBy"]) {
      fetch(apiFetchQuery)
        .then((response) => response.json())
        .then((json) => setAudiobooks(json))
        .catch((error) => console.error(error))
        .finally(() => {
          setLoadingAudioBooks(false);
        });
    }
  }, [
    props.apiSettings,
    props.searchBarInputSubmitted,
    props.apiSettingsHaveBeenSet,
  ]);

  const bookCoverURL: any[] = [];
  const reviewsURL: any[] = [];
  useEffect(() => {
    if (data.books) {
      const dataKeys = Object.values(data.books);
      let bookCoverImagePath;
      dataKeys.forEach((bookCoverURLPath: any) => {
        bookCoverImagePath = bookCoverURLPath.url_zip_file.split("/");
        bookCoverImagePath = bookCoverImagePath[bookCoverImagePath.length - 2];
        const reviewUrl = encodeURI(
          `https://archive.org/metadata/${bookCoverImagePath}/reviews/`
        );
        bookCoverImagePath = encodeURI(
          `https://archive.org/services/get-item-image.php?identifier=${bookCoverImagePath}`
        );
        bookCoverURL.push(bookCoverImagePath);
        reviewsURL.push(reviewUrl);
      });
      setBookCovers(bookCoverURL);
      setReviewsUrlList(reviewsURL);
    }
  }, [data.books]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const resizeCoverImageHeight = windowHeight / 5;
  const resizeCoverImageWidth = windowWidth / 2 - 42;
  const navigation = useNavigation();
  const keyExtractor = (item: any, index: any) => index.toString();
  const renderItem = ({ item, index }) => (
    <View>
      <ListItem
        topDivider
        containerStyle={styles.AudioBookListView}
        key={item.id}
      >
        <View style={styles.ImageContainer}>
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1.0 }]}
            onPress={() => {
              if (avatarOnPressEnabled) {
                console.log(item);
                addAudiobookToHistory({
                  audiobook_rss_url: item?.url_rss,
                  audiobook_id: item?.id,
                  audiobook_image: bookCovers[index],
                  audiobook_num_sections: item?.num_sections,
                  audiobook_ebook_url: item?.url_text_source,
                  audiobook_zip: item?.url_zip_file,
                  audiobook_title: item?.title,
                  audiobook_author_first_name: item?.authors[0]?.first_name,
                  audiobook_author_last_name: item?.authors[0]?.last_name,
                  audiobook_total_time: item?.totaltime,
                  audiobook_total_time_secs: item?.totaltimesecs,
                  audiobook_copyright_year: item?.copyright_year,
                  audiobook_genres: item?.genres,
                  audiobook_review_url: reviewURLS[index],
                  audiobook_language: item?.language,
                  audiobook_project_url: item?.url_project,
                  audiobook_librivox_url: item?.url_librivox,
                  audiobook_iarchive_url: item?.url_iarchive,
                });
                navigation.navigate("Audio", {
                  audioBookId: item?.id,
                  urlRss: item?.url_rss,
                  coverImage: bookCovers[index],
                  numSections: item?.num_sections,
                  urlTextSource: item?.url_text_source,
                  urlZipFile: item?.url_zip_file,
                  title: item?.title,
                  authorFirstName: item?.authors[0]?.first_name,
                  authorLastName: item?.authors[0]?.last_name,
                  totalTime: item?.totaltime,
                  totalTimeSecs: item?.totaltimesecs,
                  copyrightYear: item?.copyright_year,
                  genres: item?.genres,
                  urlReview: reviewURLS[index],
                  language: item?.language,
                  urlProject: item?.url_project,
                  urlLibrivox: item?.url_librivox,
                  urlIArchive: item?.url_iarchive,
                });
              }
              setAvatarOnPressEnabled(false);
              setTimeout(() => {
                setAvatarOnPressEnabled(true);
              }, 2000);
            }}
          >
            <Image
              source={{ uri: bookCovers[index] }}
              loadingIndicatorSource={{}}
              style={{
                width: resizeCoverImageWidth,
                height: resizeCoverImageHeight,
              }}
            />
          </Pressable>
        </View>
      </ListItem>
      <AudiobookAccordionList
        accordionTitle={item?.title}
        audiobookTitle={item?.title}
        audiobookAuthorFirstName={item?.authors[0]?.first_name}
        audiobookAuthorLastName={item?.authors[0]?.last_name}
        audiobookTotalTime={item?.totaltime}
        audiobookCopyrightYear={item?.copyright_year}
        audiobookGenres={JSON.stringify(item?.genres)}
        audiobookLanguage={item?.language}
      />
    </View>
  );

  if (!loadingAudioBooks) {
    return (
      <View style={styles.audiobookContainer}>
        <FlatList
          data={data.books}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
        />
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
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    width: windowWidth / 2 - 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
  },
  audiobookContainer: {
    paddingBottom: 15,
    marginBottom: 10,
    marginTop: 2,
    borderRadius: 2,
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2 - 90,
    color: "green",
  },
  AudioBookListView: {
    backgroundColor: "#51361a",
  },
});
