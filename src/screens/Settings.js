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
} from "react-native";
import ButtonPanel from "../components/ButtonPanel";
import SettingsList from "react-native-settings-list";
import MaterialIcon from "react-native-vector-icons/MaterialIcons.js";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

const userSettings = () => {
  const [switchValue, setColorToggle] = useState(false);
  const [switchValue2, setSwitchValue2] = useState(false);

  function onValueChange() {
    setColorToggle(!switchValue);
  }

  function onValueChange2() {
    setSwitchValue2(!switchValue2);
  }
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
            fontSize: 25 ,
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
              <MaterialIconCommunity
                name="wifi"
                size={50}
              color={"black"}
              />
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
          <SettingsList.Item hasNavArrow={false} title="Switch Example" />
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
              <MaterialIconCommunity
                name="github"
                size={50}
              color={"black"}
              />
            }
            title="GitHub: LeeWannacott"
            onPress={() => Alert.alert("Different Colors Example Pressed")}
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
