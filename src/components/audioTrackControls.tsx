import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View, Dimensions } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, List, Colors, Switch } from "react-native-paper";

function AudioTrackControls(props: any) {
  const controlPanelButtonSize = 30;
  const {
    loadingCurrentAudiotrack,
    rewindTenSeconds,
    HandlePrev,
    HandleNext,
    PlayAudio,
    forwardTenSeconds,
    currentAudioTrackIndex,
    trackPositions,
  } = props;

  return (
    <View style={styles.controlsVert}>
      <View style={styles.controls}>
        <Button mode="outlined" onPress={() => HandlePrev()}>
          <MaterialIcons
            name="skip-previous"
            size={controlPanelButtonSize}
            color="black"
            style={styles.control}
          />
        </Button>
        <Button mode="outlined" onPress={() => rewindTenSeconds()}>
          <MaterialCommunityIcons
            name="rewind-10"
            size={controlPanelButtonSize}
            color="black"
            style={styles.control}
          />
        </Button>
        {loadingCurrentAudiotrack ? (
          <View style={styles.ActivityIndicatorContainer}>
            <ActivityIndicator size={"large"} color="#00ff00" />
          </View>
        ) : props.loadedCurrentAudiotrack === false ? (
          <Button
            mode="outlined"
            onPress={() =>
              props.LoadAudio(
                currentAudioTrackIndex.current,
                trackPositions.currentAudiotrackPositionsMs[
                  currentAudioTrackIndex.current
                ]
              )
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
          <View style={styles.ActivityIndicatorContainer}>
            <ActivityIndicator size={"large"} color="#00ff00" />
          </View>
        ) : (
          <Button mode="outlined" onPress={() => PlayAudio()}>
            <MaterialIcons
              name="play-arrow"
              size={controlPanelButtonSize}
              color="black"
              style={styles.control}
            />
          </Button>
        )}
        <Button mode="outlined" onPress={() => forwardTenSeconds()}>
          <MaterialCommunityIcons
            name="fast-forward-10"
            size={controlPanelButtonSize}
            color="black"
            style={styles.control}
          />
        </Button>
        <Button mode="outlined" onPress={() => HandleNext()}>
          <MaterialIcons
            name="skip-next"
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
    height: 60,
  },
  control: {
    color: "black",
  },
  ActivityIndicatorContainer: {
    width: 64,
  },
});

export default AudioTrackControls;
