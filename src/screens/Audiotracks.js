import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { ListItem, Image, Slider } from "react-native-elements";
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
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [sound, setSound] = React.useState();
  const [isPlaying, setisPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [AudioBooksRSSLinkToAudioTracks, AudioBookId] = props.route.params;

  useEffect(() => {
    fetch(AudioBooksRSSLinkToAudioTracks)
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) => {
        setData(rss.items);
        setData3(rss);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        const listRSSURLS = [];
        const rssURLS = Object.entries(data);
        rssURLS.forEach(([key, value]) => {
          listRSSURLS.push(value.enclosures[0].url);
        });
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://librivox.org/api/feed/audiobooks/?id=${AudioBookId}&extended=1&format=json`
    )
      .then((response) => response.json())
      .then((json) => setData2(json.books))
      .catch((error) => console.error(error))
      .finally(() => setLoading2(false));
  }, []);

  async function playSound(itemURL) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: itemURL });
    setSound(sound);
    
    setisPlaying(true);
      
    console.log("Playing Sound");
    await sound.playAsync();
  }

  function changeSliderValue() {
    if (isPlaying) {
      // setSliderValue(0.5);
    setSliderValue(0.4)
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {

    // setSliderValue(0.4)
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const listRSSURLS = [];
  const rssURLS = Object.entries(data);
  rssURLS.forEach(([key, value]) => {
    listRSSURLS.push(value.enclosures[0].url);
  });
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            {item.section_number}: {item.title}
          </ListItem.Title>
          <ListItem.Subtitle>{item.genres}</ListItem.Subtitle>
          <ListItem.Subtitle>
            Read by: {item.readers[0].display_name}
          </ListItem.Subtitle>
          <ListItem.Subtitle>Playtime: {item.playtime}</ListItem.Subtitle>
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
  if (!loading && !loading2) {
    const getHeader = () => {
      return (
        <View style={styles.bookHeader}>
          <Text style={styles.bookTitle}> {data2[0].title}</Text>
          <Text style={styles.bookDescription}>
            {" "}
            By {data2[0].authors[0].first_name} {data2[0].authors[0].last_name}
          </Text>
          <Text style={styles.bookDescription}>
            {" "}
            Description: {data3.description}
          </Text>
          <Text> Total time: {data2[0].totaltime} </Text>
        </View>
      );
    };
    return (
      <View style={styles.container}>
        <View style={styles.listItemHeaderStyle}>
          <FlatList
            data={data2[0].sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={getHeader}
          />
        </View>
        <View style={styles.bottom}>
      <Slider 
      value={sliderValue}
      onValueChange={(sliderValue) => {setSliderValue(sliderValue)}}
      step={0.1}
      allowTouchTrack={true}
      minimumValue={0}
      maximumValue={100}
      />
          <Text>{sliderValue} world</Text>
        </View>
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
const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: "blue",
  },
  bottom: {
    backgroundColor: "purple",
    alignContent: "flex-end",
    // top:100,
    padding: 10,
    top:-100
  },
  listItemHeaderStyle: {
    fontSize: 20,
    top: 10,
  },
  ActivityIndicatorStyle: {
    top: 100,
    // top:100,
  },
  bookTitle: {
    // top:100,
    fontSize: 30,
  },
  bookDescription: {
    // top:100,
    fontSize: 14,
  },
  bookHeader: {
    padding: 10,
  },
});

export default Audiotracks;
