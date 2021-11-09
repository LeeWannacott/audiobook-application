import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

import ButtonPanel from "../components/ButtonPanel";
import { useNavigation } from "@react-navigation/native";
import { ListItem, Avatar } from "react-native-elements";
import { FlatList, ActivityIndicator, Dimensions } from "react-native";

import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

function History() {
  const [audiobookHistory, setAudiobookHistory] = useState("");
  const [audiobooksdata, setaudiobooksdata] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from test1", [], (_, { rows }) => {
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
          source={{ uri: item.value3 }}
          style={{ width: windowWidth / 2 - 42, height: windowHeight / 5 }}
          onPress={() => {
            console.log(item.value, item.value2, item.value3);
            console.log(
              typeof item.value,
              typeof item.value2,
              typeof item.value3
            );
            navigation.navigate("Audio", [
              item.value,
              item.value2,
              item.value3,
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
        <View style={styles.test}>
          <FlatList
            data={audiobookHistory["_array"]}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            backgroundColor="black"
            containerStyle={styles.test}
          />
          <ButtonPanel buttonPressedIndex={3}/>
        </View>
        <View styles={styles.buttonStyle}>
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
  test: {
    padding: 10,
    paddingTop: 50,
    paddingBottom:0,
    marginTop: 150,
    bottom: 162,
    color: "blue",
    backgroundColor: "green",
  },
  buttonStyle: {
    paddingTop:0,
  },
  ActivityIndicatorStyle:{
    top:100,
  }
});
