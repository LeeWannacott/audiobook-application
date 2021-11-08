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
    <ListItem topDivider>
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
        <View>
          <Text>hello world {}</Text>
        </View>
        <FlatList
          data={audiobookHistory["_array"]}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          backgroundColor="black"
        />
        <View>
          <ButtonPanel styles={styles.buttonStyle} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    backgroundColor: "darkgreen",
  },
  searchBarStyle: {
    backgroundColor: "darkgreen",
  },
  scrollStyle: {
    height: 590,
    backgroundColor: "lightblue",
  },
  buttonStyle: {
    backgroundColor: "black",
  },
});
