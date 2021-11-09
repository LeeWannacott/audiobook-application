import React, { useState } from "react";
import { ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons.js";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import { useNavigation } from "@react-navigation/native";

function ButtonPanel(props) {
  const [selectedIndex, updateIndex] = useState(props.buttonPressedIndex);

  const navigation = useNavigation();
  const Explore = () => (
    <MaterialIconCommunity
      name="book-search"
      size={50}
      color={selectedIndex === 0 ? "white" : "#000"}
      onPress={() => {
        console.log("test");
        navigation.navigate("Home", []);
      }}
    />
  );

  const Favourited = () => (
    <MaterialIconCommunity
      name="bookshelf"
      size={50}
      color={selectedIndex === 1 ? "white" : "#000"}
    />
  );

  const Download = () => (
    <MaterialIcon
      name="file-download"
      size={50}
      color={selectedIndex === 2 ? "white" : "#000"}
    />
  );

  const History = () => (
    <MaterialIcon
      name="history"
      size={50}
      color={selectedIndex === 3 ? "white" : "#000"}
      onPress={() => {
        console.log("test");
        navigation.navigate("History", []);
      }}
    />
  );

  const Settings = () => (
    <MaterialIconCommunity
      name="account-cog"
      size={50}
      color={selectedIndex === 4 ? "white" : "#000"}
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
        buttons={buttons}
        containerStyle={{
          height: 71,
          width: 340,
          left: -10,
          borderRadius: 0,
          top: 0,
          padding:0,
        }}
      />
    </>
  );
}

export default ButtonPanel;
