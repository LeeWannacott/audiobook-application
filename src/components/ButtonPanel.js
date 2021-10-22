import React, { useState } from "react";
import { ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

function ButtonPanel() {
  const [selectedIndex, updateIndex] = useState(0);

  const Explore = () => (
    <Icon
      name="search"
      size={50}
      color={selectedIndex === 0 ? "white" : "#000"}
    />
  );

  const Favourited = () => (
    <Icon
      name="star"
      size={50}
      color={selectedIndex === 1 ? "white" : "#000"}
    />
  );

  const History = () => (
    <Icon
      name="history"
      size={50}
      color={selectedIndex === 2 ? "white" : "#000"}
    />
  );

  const Settings = () => (
    <Icon name="cog"
    size={50}
    color={selectedIndex === 3 ? "white" : "#000"}
    />
  );

  const buttons = [
    { element: Explore },
    { element: Favourited },
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
