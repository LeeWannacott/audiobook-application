import React, { useEffect, useState } from "react";
import { ListItem, Image } from "react-native-elements";
import * as rssParser from "react-native-rss-parser";
// import Sound from 'react-native-sound';
import { Audio } from "expo-av";

import {
  FlatList,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function Audiotracks() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sound, setSound] = React.useState();

  useEffect(() => {
    fetch("https://librivox.org/rss/52")
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        console.log(rss);
        // console.log(rss.items[0].enclosures[0])
        setData(rss);
        // rss.items.map((item) => {
        // (setData(item.enclosures[0].url));
        // });
        // console.log(rss.items[0].enclosures[0])
        console.log(rss.items.length);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const buttonPress = (itemURL) => {
    console.log(itemURL);
    }

  async function playSound(itemURL) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      { uri: itemURL }
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>{item.enclosures[0].url}</ListItem.Subtitle>
        <ListItem.Subtitle></ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
      <Button
        onPress={() => playSound(item.enclosures[0].url)}
        title="Listen"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </ListItem>
  );
  return (
    <View>
      <FlatList
        data={data.items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Audiotracks;
