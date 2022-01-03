
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import ButtonPanel from "../components/ButtonPanel";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Avatar } from "react-native-elements";
import { FlatList, ActivityIndicator, Dimensions } from "react-native";

import {openDatabase} from "../utils"

const db = openDatabase();

function History() {
  const [audiobookHistory, setAudiobookHistory] = useState("");
  const [audiobooksdata, setaudiobooksdata] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from testShelve15", [], (_, { rows }) => {
        // console.log(JSON.stringify(rows));
        // console.log(typeof JSON.stringify(rows));
        // console.log(typeof rows);
        // console.log(rows);
        setAudiobookHistory(rows);
        setLoadingHistory(false);
      });
    }, null);
  }, []);
  // console.log(2,audiobookHistory)

  // console.log(typeof audiobookHistory, audiobookHistory);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const keyExtractor = (item, index) => index.toString();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const renderItem = ({ item, index }) => (
    <ListItem topDivider style={styles.AudioBookListView}>
      <View style={styles.ImageContainer}>
        <Avatar
          source={{ uri: item.audiobook_image }}
          style={{ width: windowWidth / 2 - 42, height: windowHeight / 5 }}
          onPress={() => {
            console.log(
              item.audiobook_rss_url,
              item.audiobook_id,
              item.audiobook_image
            );
            console.log(
              typeof item.audiobook_rss_url,
              typeof item.audiobook_id,
              typeof item.audiobook_image
            );
            navigation.navigate("Audio", [
              item.audiobook_rss_url,
              item.audiobook_id,
              item.audiobook_image,
            ]);
          }}
        />
      </View>
    </ListItem>
  );

  if (!loadingHistory) {
    console.log(audiobookHistory["_array"]);
    return (
      <View>
        <View style={styles.audiobookImagesContainer}>
          <FlatList
            data={audiobookHistory["_array"]}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            backgroundColor="black"
      containerStyle={{bottom:10}}
          />
          <View styles={styles.buttonStyle}>
            <ButtonPanel buttonPressedIndex={1} />
          </View>
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
const styles = StyleSheet.create({
  ImageContainer: {
    flexDirection: "column",
    backgroundColor: "red",
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
    height: 750,
    color: "blue",
    backgroundColor: "green",
  },
  buttonStyle: {
    paddingTop: 0,
  },
  ActivityIndicatorStyle: {
    top: 150,
  },
});
