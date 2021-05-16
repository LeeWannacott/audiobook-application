import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
function Audiobooks() {
  useEffect(() => {
      // "https://librivox.org/api/feed/audiobooks/?&format=jsonp&callback=myCallback";
    const getAudiobookDataFromApi = () => {
      return fetch('https://librivox.org/api/feed/audiobooks/?&format=json')
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    };
  }, []);

 return <Text>hrllo</Text>
}

export default Audiobooks;

