
import React,{useEffect,useState} from 'react';
import {Text,View} from 'react-native';
import * as rssParser from "react-native-rss-parser";

function Audiotracks(){

  useEffect(() => {
    fetch('https://librivox.org/rss/52')
    .then((response) => response.text())
    .then((responseData) => rssParser.parse(responseData))
    .then((rss) => {
    console.log(rss.items[0].enclosures[0])
    console.log(rss.items.map((item) =>{console.log(item)}))
    console.log(rss.items[0].enclosures[0])
    console.log(rss.items.length);
    });
  }, []);

  return <View><Text>Hello Audiotracks</Text></View>

}
export default Audiotracks;
