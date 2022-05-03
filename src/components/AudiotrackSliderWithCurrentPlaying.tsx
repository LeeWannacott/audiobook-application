import Slider from "@react-native-community/slider";
import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Dimensions } from "react-native";

function AudiotrackSliderWithCurrentPlaying(props:any) {

  return (
    <View style={styles.SliderStyle}>
      <Slider
        value={props.currentSliderPosition}
        disabled={false}
        minimumValue={0.0}
        maximumValue={100.0}
        onSlidingComplete={(data) => props.SeekUpdate(data)}
      />
      <View style={styles.AudiobookTime}>
        <Text style={{ marginLeft: 10 }}>
          {" "}
          {props.GetDurationFormat(
            (props.currentSliderPosition * props.Duration) / 100
          )}{" "}
        </Text>
        <Text style={{ marginRight: 10 }}>
          {" "}
          {props.GetDurationFormat(props.Duration)}
        </Text>
      </View>
      <View style={styles.SliderContainer}>
        <Image
          source={{ uri: props.bookCoverImage }}
          style={{
            width: 50,
            height: 50,
            marginRight: 5,
          }}
        />
        <View>
          <Text numberOfLines={2} ellipsizeMode="tail" style={{}}>
            {" "}
            {props.audioTrackChapterPlayingTitle}{" "}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {" "}
            {props.audioTrackReader}{" "}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default AudiotrackSliderWithCurrentPlaying;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
    paddingTop: 2,
  },
  AudioTracksStyle: {
    flex: 7,
    paddingBottom: 2,
  },
  AudiobookTime: {
    display: "flex",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    // top: -200,
    // padding: 10,
    minHeight: 20,
  },
  SliderStyle: {
    backgroundColor: "white",
    // top: -200,
    // padding: 10,
    // flex: 1,
  },
  SliderContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingLeft: 5,
    maxWidth: windowWidth - 70,
  },
  listItemHeaderStyle: {
    fontSize: 20,
    backgroundColor: "black",
  },
  ActivityIndicatorStyle: {
    top: windowHeight / 2,
    color: "green",
  },
  bookTitle: {
    // top:100,
    fontSize: 30,
  },
  bookAuthor: {
    // top:100,
    fontWeight: "bold",
  },
  bookDescription: {
    // top:100,
    fontSize: 16,
    padding: 2,
  },
  bookHeader: {
    display: "flex",
    paddingBottom: 0,
    padding: 2,
  },
  shelveButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  reviewFooter: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sectionTitles: {
    color: "white",
    fontSize: 16,
  },
  sectionTitlesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
});
