import React, { useState, useEffect } from "react";
import {
  FlatList,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ListItem, Image } from "react-native-elements";
import AudiobookCard from "./AudiobookCard";
import { withNavigation } from 'react-navigation';
  
function Audiobooks({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://librivox.org/api/feed/audiobooks/?&extended=1&format=json")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    // fetch('https://librivox.org/rss/52')
    // .then((response) => response.text())
    // .then((responseData) => rssParser.parse(responseData))
    // .then((rss) => {
    // console.log(rss.items[0].enclosures[0])
    // console.log(rss.items.map((item) =>{console.log(item)}))
    // console.log(rss.items[0].enclosures[0])
    // console.log(rss.items.length);
    // });
    //
  }, []);
  // keyExtractor = (item, index) => index.toString()
  // keyExtractor=({ id }, index) => id
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item ,navigation  }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>
          Author: {item.authors[0].first_name} {item.authors[0].last_name},
          Lived: {item.authors[0].dob} - {item.authors[0].dod}
        </ListItem.Subtitle>
        <ListItem.Subtitle>Listen: {item.url_rss}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
      <Button
        onPress={() => navigation.navigate("Home")}
        title="Loading"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </ListItem>
  );
  return (
    <View>
      <FlatList
        data={data.books}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        navigation={navigation}
      />
    </View>
  );
}

export default withNavigation(Audiobooks);
