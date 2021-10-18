import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

class ButtonPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 2,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
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
    const { selectedIndex } = this.state;

    return (
      <>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{ height: 70, width: 340, top: 25, left: -10 }}
        />
      </>
    );
  }
}
export default ButtonPanel;
