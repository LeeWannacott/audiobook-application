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

  const openURLLink = async ({ url }) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View style={{ backgroundColor: "#f6f6f6", flex: 1 }}>
      <View
        style={{
          borderBottomWidth: 1,
          backgroundColor: "#263238",
          borderColor: "#c8c7cc",
        }}
      >
        <Text
          style={{
            color: "white",
            marginTop: 35,
            marginBottom: 15,
            marginLeft: 15,
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          Settings
        </Text>
      </View>
      <View style={{ backgroundColor: "#f6f6f6", flex: 1 }}>
        <SettingsList>
          <SettingsList.Header
            headerText="Audiobook settings"
            headerStyle={{ color: "#009688", marginTop: 20 }}
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
            hasNavArrow={false}
            title="Delete History"
            onPress={() =>
              Alert.alert(
                "Delete History",
                "Are you sure you want to delete audiobook viewing history?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Delete History",
                    onPress: () => deleteAudiobookHistory(db),
                  },
                ]
              )
            }
          />
          <SettingsList.Header
            headerText="About"
            headerStyle={{ color: "#009688", marginTop: 20 }}
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
                    onPress: () => {Linking.openURL("https://github.com/LeeWannacott")},
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
  buttonStyle: {
    paddingTop: 0,
  },
});

export default userSettings;
