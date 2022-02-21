import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import ButtonPanel from "../components/ButtonPanel";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Avatar } from "react-native-elements";
import { FlatList, ActivityIndicator, Dimensions } from "react-native";
import { List, Divider } from "react-native-paper";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

import { openDatabase } from "../utils";

const db = openDatabase();

function History() {
  const [audiobookHistory, setAudiobookHistory] = useState("");
  const [audiobooksdata, setaudiobooksdata] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from testHistory14", [], (_, { rows }) => {
        setAudiobookHistory(rows);
        setLoadingHistory(false);
      });
    }, null);
  }, []);
  // console.log("Audiobook_History", audiobookHistory);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  const keyExtractor = (item, index) => index.toString();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const renderItem = ({ item, index }) => (
    <View>
      <ListItem topDivider containerStyle={styles.AudioBookListView}>
        <View style={styles.ImageContainer}>
          <Avatar
            source={{ uri: item.audiobook_image }}
            style={{ width: windowWidth / 2 - 42, height: windowHeight / 5 }}
            onPress={() => {
              navigation.navigate("Audio", [
                item.audiobook_rss_url,
                item.audiobook_id,
                item.audiobook_image,
                item.audiobook_title,
                item.audiobook_author_first_name,
                item.audiobook_author_last_name,
                item.audiobook_total_time,
                item.audiobook_copyright_year,
                item.audiobook_genres,
              ]);
            }}
          />
        </View>
      </ListItem>
      <List.Accordion
        titleStyle={styles.accordionTitleStyle}
        style={styles.accordionStyle}
        accessibilityLabel={item.title}
        theme={{ colors: { text: "white" } }}
      >
        <List.Section style={styles.accordianItemsStyle}>
          <ListItem.Subtitle style={styles.accordianItemsStyle}>
            <MaterialIconCommunity
              name="format-title"
              size={20}
            ></MaterialIconCommunity>
            {": "}
            {item.audiobook_title}
          </ListItem.Subtitle>
          <Divider />

          <ListItem.Subtitle style={styles.accordianItemsStyle}>
            <MaterialIconCommunity
              name="feather"
              size={20}
            ></MaterialIconCommunity>
            {": "}
            {item.audiobook_author_first_name} {item.audiobook_author_last_name}
          </ListItem.Subtitle>
          <Divider />

          <ListItem.Subtitle style={styles.accordianItemsStyle}>
            <MaterialIconCommunity
              name="timer-sand"
              size={20}
            ></MaterialIconCommunity>
            {": "}
            {item.audiobook_total_time}
          </ListItem.Subtitle>
          <Divider />

          <ListItem.Subtitle style={styles.accordianItemsStyle}>
            <MaterialIconCommunity
              name="copyright"
              size={20}
            ></MaterialIconCommunity>
            {": "}
            {item.audiobook_copyright_year}
          </ListItem.Subtitle>
          <Divider />
          <ListItem.Subtitle style={styles.accordianItemsStyle}>
            <MaterialIconCommunity
              name="guy-fawkes-mask"
              size={20}
            ></MaterialIconCommunity>
            {": "}
            {JSON.parse(item.audiobook_genres).map((genre) => {
              return `${genre.name} `;
            })}
          </ListItem.Subtitle>
        </List.Section>
      </List.Accordion>
    </View>

  );

  if (!loadingHistory) {
    // console.log(audiobookHistory["_array"]);
    return (
      <View>
        <View style={styles.flatListStyle}>
          <FlatList
            data={audiobookHistory["_array"]}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            containerStyle={{ bottom: 10 }}
          />
          <View styles={styles.buttonStyle}>
            <ButtonPanel buttonPressedIndex={3} />
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
    height: 750,
    color: "blue",
    backgroundColor: "#331800",
  },
  buttonStyle: {
    paddingTop: 0,
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2,
    color: "green",
  },
  accordionStyle: {
    flex: 1,
    color: "white",
    backgroundColor: "#331800",
    width: windowWidth / 2 - 8,
    justifyContent: "center",
    height: 50,
  },
  accordionTitleStyle: {
    color: "black",
    backgroundColor: "#331800",
    width: windowWidth / 2 - 8,
    flex: 1,
    height: 40,
  },
  AudioBookListView: {
    backgroundColor: "#51361a",
  },
  accordianItemsStyle: {
    color: "white",
    backgroundColor: "#51361a",
    width: windowWidth / 2 - 15,
  },
});
