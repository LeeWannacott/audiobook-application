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

function Audiotracks(props) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [sound, setSound] = React.useState();
  const [AudioBooksRSSLinkToAudioTracks, AudioBookId]  = props.route.params;
  // console.log(AudioBooksRSSLinkToAudioTracks, AudioBookId)

  useEffect(() => {
    fetch(AudioBooksRSSLinkToAudioTracks)
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        setData(rss.items);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
  // console.log(data)

  useEffect(() => {
    fetch(`https://librivox.org/api/feed/audiobooks/?id=${AudioBookId}&extended=1&format=json`)
      .then((response) => response.json())
      .then((json) => setData2(json.books))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);


    // console.log(data.items[0].enclosures)

    // console.log(data2.books)
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

// console.log(Object.values(data))
  const listRSSURLS = []
  const rssURLS = Object.entries(data)
  rssURLS.forEach(([key,value]) =>{
    listRSSURLS.push(value.enclosures[0].url)
  });
  console.log(data2)
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <View>
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.language}</ListItem.Title>
        <ListItem.Subtitle></ListItem.Subtitle>
        <ListItem.Subtitle>{item.section_number}</ListItem.Subtitle>
        <ListItem.Subtitle></ListItem.Subtitle>
        <ListItem.Subtitle></ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />

      <Button
        onPress={() => playSound(listRSSURLS[index])}
        title="Listen"
        color="#841584"
        accessibilityLabel="purple button"
      />
    </ListItem>
    </View>
  );

  return (
    <View>
    <Text>{data2[0].description}</Text>
    

      <FlatList
      data={data2[0].sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />

    </View>
  );
}

export default Audiotracks;
