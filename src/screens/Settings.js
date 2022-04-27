import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import SettingsList from "react-native-settings-list";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import {
  deleteAudiobookHistoryDB,
  storeAsyncData,
} from "../database_functions";

const UserSettings = () => {
  const [switches, setSwitches] = useState({
    switchValue: false,
    switchValue2: false,
    switchValue3: true,
    switchValue4: true,
    switchValue5: true,
  });
  const [audioModeSettings, setAudioModeSettings] = useState({
    interruptionModeAndroid: 1,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
  });

  function onValueChange() {
    setSwitches({ ...switches, switchValue: !switches.switchValue });
  }

  const storeAudioModeSettings = (tempApiSettings) => {
    storeAsyncData("audioModeSettings", tempApiSettings);
  };

  function staysActiveInBackgroundToggle() {
    setSwitches({ ...switches, switchValue3: !switches.switchValue3 });
    setAudioModeSettings({
      ...audioModeSettings,
      staysActiveInBackground: !audioModeSettings.staysActiveInBackground,
    });
    storeAudioModeSettings({
      ...audioModeSettings,
      staysActiveInBackground: !audioModeSettings.staysActiveInBackground,
    });
  }

  function shouldDuckAndroidToggle() {
    setSwitches({ ...switches, switchValue4: !switches.switchValue4 });
    setAudioModeSettings({
      ...audioModeSettings,
      shouldDuckAndroid: !audioModeSettings.shouldDuckAndroid,
    });
    storeAudioModeSettings("audioModeSettings", {
      ...audioModeSettings,
      shouldDuckAndroid: !audioModeSettings.shouldDuckAndroid,
    });
  }

  function playThroughEarpieceAndroidToggle() {
    setSwitches({ ...switches, switchValue5: !switches.switchValue5 });
    setAudioModeSettings({
      ...audioModeSettings,
      playThroughEarpieceAndroid: !audioModeSettings.playThroughEarpieceAndroid,
    });
    storeAudioModeSettings("audioModeSettings", {
      ...audioModeSettings,
      playThroughEarpieceAndroid: !audioModeSettings.playThroughEarpieceAndroid,
    });
  }

  const deleteAudiobookHistory = (db) => {
    deleteAudiobookHistoryDB(db);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsStyleBlock}>
        <Text style={styles.settingsTitleText}>Settings</Text>
      </View>
      <View style={styles.sectionHeadings}>
        <SettingsList>
          <SettingsList.Header
            headerText="Audiobook settings"
            headerStyle={styles.audiobookSettingsSubHeading}
          />
          <SettingsList.Item
            icon={
              <MaterialIconCommunity
                name="theme-light-dark"
                size={50}
                color={"black"}
              />
            }
            itemWidth={50}
            title="Color scheme"
            hasNavArrow={false}
            switchState={switches.switchValue}
            switchOnValueChange={onValueChange}
            hasSwitch={true}
          />
          <SettingsList.Item
            icon={<MaterialIconCommunity name="" size={50} color={"black"} />}
            hasNavArrow={false}
            title="Stays active in background."
            itemWidth={50}
            switchState={switches.switchValue3}
            switchOnValueChange={staysActiveInBackgroundToggle}
            hasSwitch={true}
            onPress={() =>
              Alert.alert(
                "Stays active in background.",
                "Select if the audio session playback should stay active even when the app goes into the background.",
                [
                  {
                    text: "Close",
                    style: "cancel",
                  },
                ]
              )
            }
          />
          <SettingsList.Item
            icon={
              <MaterialIconCommunity name="duck" size={50} color={"black"} />
            }
            hasNavArrow={false}
            title="Duck Audio"
            itemWidth={50}
            switchState={switches.switchValue4}
            switchOnValueChange={shouldDuckAndroidToggle}
            hasSwitch={true}
            onPress={() =>
              Alert.alert(
                "Duck Audio",
                "Select if your experience's audio should automatically be lowered in volume (duck), if audio from another app interrupts your experience. If false, audio from other apps will pause your audio.",
                [
                  {
                    text: "Close",
                    style: "cancel",
                  },
                ]
              )
            }
          />
          <SettingsList.Item
            icon={
              <MaterialIconCommunity name="headset" size={50} color={"black"} />
            }
            hasNavArrow={false}
            title="Play through earpiece"
            itemWidth={50}
            switchState={switches.switchValue5}
            switchOnValueChange={playThroughEarpieceAndroidToggle}
            hasSwitch={true}
            onPress={() =>
              Alert.alert(
                "Play through earpiece",
                "selecting if the audio is routed to earpiece.",
                [
                  {
                    text: "Close",
                    style: "cancel",
                  },
                ]
              )
            }
          />
          <SettingsList.Item
            icon={
              <MaterialIconCommunity name="history" size={50} color={"black"} />
            }
            hasNavArrow={true}
            title="Delete viewing history"
            onPress={() =>
              Alert.alert(
                "Delete history",
                "Are you sure you want to delete audiobook viewing history?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                  },
                  {
                    text: "Delete History",
                    onPress: () => deleteAudiobookHistory(db),
                  },
                ],
                {
                  cancelable: true,
                }
              )
            }
          />
          <SettingsList.Header
            headerText="About"
            headerStyle={styles.audiobookSettingsSubHeading}
          />
          <SettingsList.Item
            icon={
              <MaterialIconCommunity
                name="information-variant"
                size={50}
                color={"green"}
              />
            }
            titleInfo="0.1.0"
            hasNavArrow={false}
            title="Version: "
          />
          <SettingsList.Item
            hasNavArrow={true}
            icon={
              <MaterialIconCommunity name="github" size={50} color={"black"} />
            }
            title="GitHub: LeeWannacott"
            onPress={() =>
              Alert.alert(
                "GitHub",
                "Checkout my GitHub to open issues, contribute, or support development.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "github",
                    onPress: () => {
                      Linking.openURL("https://github.com/LeeWannacott");
                    },
                  },
                ]
              )
            }
          />
          <SettingsList.Item
            hasNavArrow={false}
            icon={
              <MaterialIconCommunity
                name="ethereum"
                size={50}
                color={"#c99d66"}
                borderWidth={2}
              />
            }
            title="Ethereum: xxxxx"
          />
        </SettingsList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#331800", flex: 1 },
  title: {
    fontSize: 24,
  },
  sectionHeadings: { backgroundColor: "#f6f6f6", flex: 1 },
  settingsTitleText: {
    color: "white",
    marginTop: 35,
    marginBottom: 15,
    marginLeft: 15,
    fontWeight: "bold",
    fontSize: 25,
  },
  audiobookSettingsSubHeading: { color: "#009688", marginTop: 20 },
  settingsStyleBlock: {
    borderBottomWidth: 1,
    backgroundColor: "#263238",
    borderColor: "red",
  },
});

export default UserSettings;
