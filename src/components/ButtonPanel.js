import React,{useState} from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

function ButtonPanel(props) {
const [selectedIndex, updateIndex] = useState(2);
    const component1 = () => (
      <Text>
        <Icon
          name="search"
          size={50}
          color={selectedIndex === 0 ? "white" : "#000"}
        />{" "}
        Explore
      </Text>
    );
    const component2 = () => (
      <Text>
        <Icon
          name="star"
          size={50}
          color={selectedIndex === 1 ? "white" : "#000"}
        />{" "}
        Starred
      </Text>
    );
    const component3 = () => (
      <Text>
        <Icon
          name="history"
          size={50}
          color={selectedIndex === 2 ? "white" : "#000"}
        />{" "}
        History
      </Text>
    );
    const buttons = [
      { element: component1 },
      { element: component2 },
      { element: component3 },
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
            top: 24,
            left: -10,
            borderRadius: 0,
          }}
        />
      </>
    );
  
}
export default ButtonPanel;
