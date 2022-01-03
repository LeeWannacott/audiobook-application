import React, { useState } from "react";
import { ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons.js";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import { useNavigation } from "@react-navigation/native";

function ButtonPanel(props) {
  const [selectedIndex, updateIndex] = useState(props.buttonPressedIndex);
  const [buttonColor, setButtonColor] = useState("#F0F6FC");
  const [colorButtonPressed, setColorButtonPressed] = useState("#58A6FF");

  const navigation = useNavigation();
  const Explore = () => (
    <MaterialIconCommunity
      name="book-search"
      size={50}
      color={selectedIndex === 0 ? colorButtonPressed : "white"}
      onPress={() => {
        navigation.navigate("Home", []);
      }}
    />
  );

  const Favourited = () => (
    <MaterialIconCommunity
      name="bookshelf"
      size={50}
      color={selectedIndex === 1 ? colorButtonPressed : buttonColor}
      onPress={() => {
      navigation.navigate("Bookshelf", []);
      }}
    />
  );

  const Download = () => (
    <MaterialIcon
      name="file-download"
      size={50}
      color={selectedIndex === 2 ? colorButtonPressed : buttonColor}
      onPress={() => {
        navigation.navigate("Downloads", []);
      }}
    />
  );

  const History = () => (
    <MaterialIcon
      name="history"
      size={50}
      color={selectedIndex === 3 ? colorButtonPressed : buttonColor}
      onPress={() => {
        navigation.navigate("History", []);
      }}
    />
  );

  const Settings = () => (
    <MaterialIconCommunity
      name="account-cog"
      size={50}
      color={selectedIndex === 4 ? colorButtonPressed : buttonColor}
      onPress={() => {
        navigation.navigate("Settings", []);
      }}
    />
  );

  const buttons = [
    { element: Explore },
    { element: Favourited },
    { element: Download },
    { element: History },
    { element: Settings },
  ];

  return (
    <>
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        // underlayColor={"red"}
        innerBorderStyle={{color:"#161B22"}}
        // setOpacityTo={1}
        // activeOpacity={1}
        buttons={buttons}
        // buttonStyle={{backgroundColor:"red"}}
        selectedButtonStyle={{backgroundColor:"#161B22"}}
        containerStyle={{
          height: 71,
          backgroundColor:"#161B22",
          width: 340,
          left: -10,
          borderRadius: 0,
          borderWidth: 0,
          top: 0,
          padding:0,
        }}
      />
    </>
  );
}

export default ButtonPanel;
