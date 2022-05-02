import React, { useState } from "react";
import {ActivityIndicator,StyleSheet,View,Dimensions} from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
  const [controlPanelButtonSize] = useState(30);
import { Button, List, Colors, Switch } from "react-native-paper";

function AudioTrackControls(props:any){

  return(
        <View style={styles.controlsVert}>
          <View style={styles.controls}>
            <Button mode="outlined">
              <MaterialIcons
                name="reply"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
            <Button mode="outlined" onPress={() => props.HandlePrev()}>
              <MaterialIcons
                name="skip-previous"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
            {props.loadingCurrentAudiotrack ? (
              <ActivityIndicator size={"large"} color={"dodgerblue"} />
            ) : props.loadedCurrentAudiotrack === false ? (
              <Button
                mode="outlined"
                onPress={() => props.LoadAudio(props.currentAudioTrackIndex.current)}
              >
                <MaterialIcons
                  name="not-started"
                  size={controlPanelButtonSize}
                  color="black"
                  style={styles.control}
                />
              </Button>
            ) : props.Playing ? (
              <Button mode="outlined" onPress={() => props.PauseAudio()}>
                <MaterialIcons
                  name="pause"
                  size={controlPanelButtonSize}
                  color="black"
                  style={styles.control}
                />
              </Button>
            ) : props.audioPaused === false ? (
              <ActivityIndicator size={"large"} color={"dodgerblue"} />
            ) : (
              <Button mode="outlined" onPress={() => props.PlayAudio()}>
                <MaterialIcons
                  name="play-arrow"
                  size={controlPanelButtonSize}
                  color="black"
                  style={styles.control}
                />
              </Button>
            )}
            <Button mode="outlined" onPress={() => props.HandleNext()}>
              <MaterialIcons
                name="skip-next"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
            <Button mode="outlined" onPress={props.toggleOverlay}>
              <MaterialIcons
                name="list"
                size={controlPanelButtonSize}
                color="black"
                style={styles.control}
              />
            </Button>
          </View>
        </View>
  )

}

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
  AudioTracksStyle2: {},
  controlsVert: {
    flex: 0.8,
  },
  controls: {
    flex: 1,
    // top:-100,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
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
  albumCover: {
    width: 250,
    height: 250,
  },
  control: {
    height: 50,
    borderRadius: 25,
    color: "black",
    margin: 30,
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
  sliderWithIconsOnSides: {
    display: "flex",
    flexDirection: "row",
  },
});

export default AudioTrackControls
