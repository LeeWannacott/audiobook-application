import React from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { Overlay } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons.js";
import Slider from "@react-native-community/slider";

function AudioTrackSettings(props: any) {
  async function onToggleMuteSwitch(muteToggled: boolean) {
    try {
      props.setAudioPlayerSettings({
        ...props.audioPlayerSettings,
        isMuted: !props.audioPlayerSettings.isMuted,
      });
      const result = await props.sound.current.getStatusAsync();
      if (muteToggled) {
        if (result.isLoaded === true) {
          await props.sound.current.setIsMutedAsync(true);
        }
      } else if (!muteToggled) {
        if (result.isLoaded === true) {
          await props.sound.current.setIsMutedAsync(false);
        }
      }
      await props.storeAudioTrackSettings({
        ...props.audioPlayerSettings,
        isMuted: !props.audioPlayerSettings.isMuted,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function onTogglePitchSwitch(pitchToggled: boolean) {
    try {
      props.setAudioPlayerSettings({
        ...props.audioPlayerSettings,
        shouldCorrectPitch: !props.audioPlayerSettings.shouldCorrectPitch,
      });
      const result = await props.sound.current.getStatusAsync();
      if (pitchToggled) {
        if (result.isLoaded === true) {
          await props.sound.current.setRateAsync(
            props.audioPlayerSettings.rate,
            true
          );
        }
      } else if (!pitchToggled) {
        if (result.isLoaded === true) {
          await props.sound.current.setRateAsync(
            props.audioPlayerSettings.rate,
            false
          );
        }
      }
      await props.storeAudioTrackSettings({
        ...props.audioPlayerSettings,
        shouldCorrectPitch: !props.audioPlayerSettings.shouldCorrectPitch,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function onToggleLoopSwitch(loopToggled: boolean) {
    try {
      props.setAudioPlayerSettings({
        ...props.audioPlayerSettings,
        isLooping: !props.audioPlayerSettings.isLooping,
      });
      const result = await props.sound.current.getStatusAsync();
      if (loopToggled) {
        if (result.isLoaded === true) {
          await props.sound.current.setIsLoopingAsync(true);
        }
      } else if (!loopToggled) {
        if (result.isLoaded === true) {
          await props.sound.current.setIsLoopingAsync(false);
        }
      }
      await props.storeAudioTrackSettings({
        ...props.audioPlayerSettings,
        isLooping: !props.audioPlayerSettings.isLooping,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Overlay
      isVisible={props.visible}
      onBackdropPress={props.toggleOverlay}
      fullScreen={false}
    >
      <Text>Volume of Audiotrack: {props.audioPlayerSettings.volume}</Text>
      <View style={styles.sliderWithIconsOnSides}>
        <MaterialCommunityIcons
          name={"volume-minus"}
          size={30}
          color={"black"}
        />
        <Slider
          value={props.audioPlayerSettings.volume}
          style={{ width: 200, height: 40 }}
          minimumValue={0.0}
          maximumValue={1.0}
          minimumTrackTintColor="#50C878"
          thumbTintColor="#228B22"
          step={0.25}
          onValueChange={async (volumeLevel: number) => {
            try {
              const result = await props.sound.current.getStatusAsync();
              props.setAudioPlayerSettings({
                ...props.audioPlayerSettings,
                volume: volumeLevel,
              });
              if (result.isLoaded === true) {
                await props.sound.current.setVolumeAsync(volumeLevel);
              }
              await props.storeAudioTrackSettings({
                ...props.audioPlayerSettings,
                volume: volumeLevel,
              });
            } catch (e) {
              console.log(e);
            }
          }}
        />
        <MaterialCommunityIcons
          name={"volume-plus"}
          size={30}
          color={"black"}
        />
      </View>
      <Text>
        Pitch Correction: {props.audioPlayerSettings.shouldCorrectPitch}
      </Text>
      <Switch
        value={props.audioPlayerSettings.shouldCorrectPitch}
        onValueChange={onTogglePitchSwitch}
      />
      <Text>Mute: {props.audioPlayerSettings.isMuted}</Text>
      <Switch
        value={props.audioPlayerSettings.isMuted}
        onValueChange={onToggleMuteSwitch}
      />
      <Text>looping: {props.audioPlayerSettings.isLooping}</Text>
      <Switch
        value={props.audioPlayerSettings.isLooping}
        onValueChange={onToggleLoopSwitch}
      />
      <Text>Speed of Audiotrack: {props.audioPlayerSettings.rate}X</Text>
      <View style={styles.sliderWithIconsOnSides}>
        <MaterialCommunityIcons name={"tortoise"} size={30} color={"black"} />
        <Slider
          value={props.audioPlayerSettings.rate}
          style={{ width: 200, height: 40 }}
          minimumValue={0.5}
          maximumValue={2.0}
          minimumTrackTintColor="#50C878"
          thumbTintColor="#228B22"
          step={0.25}
          onValueChange={async (speed: number) => {
            try {
              props.setAudioPlayerSettings({
                ...props.audioPlayerSettings,
                rate: speed,
              });
              const result = await props.sound.current.getStatusAsync();
              if (result.isLoaded === true) {
                await props.sound.current.setRateAsync(
                  speed,
                  props.audioPlayerSettings.shouldCorrectPitch
                );
              }
              await props.storeAudioTrackSettings({
                ...props.audioPlayerSettings,
                rate: speed,
              });
            } catch (e) {
              console.log(e);
            }
          }}
        />
        <MaterialCommunityIcons name={"rabbit"} size={30} color={"black"} />
      </View>
    </Overlay>
  );
}

export default AudioTrackSettings;

const styles = StyleSheet.create({
  sliderWithIconsOnSides: {
    display: "flex",
    flexDirection: "row",
  },
});
