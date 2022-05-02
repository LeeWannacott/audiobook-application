import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, List, Colors, Switch } from "react-native-paper";

function AudioTrackControls(props: any) {
  const controlPanelButtonSize = 30;

  return (
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
            onPress={() =>
              props.LoadAudio(props.currentAudioTrackIndex.current)
            }
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
  );
}

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    // top:-100,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  controlsVert: {
    flex: 0.8,
  },
  control: {
    height: 50,
    borderRadius: 25,
    color: "black",
    margin: 30,
  },
});

export default AudioTrackControls;
