import React, { useState } from "react";
import { ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons.js";



function ButtonPanel() {
  const [selectedIndex, updateIndex] = useState(0);

  const Explore = () => (
    <MaterialIcon
      name="search"
      size={50}
      color={selectedIndex === 0 ? "white" : "#000"}
    />
  );

  const Favourited = () => (
    <MaterialIcon
      name="bookmark-outline"
      size={50}
      color={selectedIndex === 1 ? "white" : "#000"}
    />
  );

  const Download = () => (
    <MaterialIcon name="file-download"
    size={50}
    color={selectedIndex === 2 ? "white" : "#000"}
    />
  );

  const History = () => (
    <MaterialIcon
      name="history"
      size={50}
      color={selectedIndex === 3 ? "white" : "#000"}
    />
  );


  const Settings = () => (
    <MaterialIcon name="settings"
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
          top: 5,
          left: -10,
          borderRadius: 0,
        }}
      />
    </>
  );
}

export default ButtonPanel;
