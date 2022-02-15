import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  Image,
  Alert,
  Linking,
} from "react-native";
import ButtonPanel from "../components/ButtonPanel";
import SettingsList from "react-native-settings-list";
import MaterialIcon from "react-native-vector-icons/MaterialIcons.js";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import { openDatabase } from "../utils";
const db = openDatabase();
import { deleteAudiobookHistoryDB } from "../database_functions";

const userSettings = () => {
  const [switchValue, setColorToggle] = useState(false);
  const [switchValue2, setSwitchValue2] = useState(false);

  function onValueChange() {
    setColorToggle(!switchValue);
  }
  function onValueChange2() {
    setSwitchValue2(!switchValue2);
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
            switchState={switchValue}
            switchOnValueChange={onValueChange}
            hasSwitch={true}
          />
          <SettingsList.Item
            icon={
              <MaterialIconCommunity name="wifi" size={50} color={"black"} />
            }
            itemWidth={50}
            title="wifi"
            hasNavArrow={false}
            switchState={switchValue2}
            switchOnValueChange={onValueChange2}
            hasSwitch={true}
          />
          <SettingsList.Item hasNavArrow={false} title="Switch Example" />
          <SettingsList.Item hasNavArrow={false} title="Switch Example" />
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
                  cancelable:true,
                }
              )
            }
          />
          <SettingsList.Header
            headerText="About"
            headerStyle={styles.sectionHeadings}
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
      <View styles={styles.buttonStyle}>
        <ButtonPanel buttonPressedIndex={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#331800" ,flex:1},
  title: {
    fontSize: 24,
  },
  sectionHeadings: { backgroundColor: "#f6f6f6" ,flex:1},
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
  buttonStyle: {
    position:"absolute",
    backgroundColor:"yellow",
    height:200,
  },
});

export default userSettings;
