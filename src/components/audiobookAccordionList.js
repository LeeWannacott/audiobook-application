import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { List, Divider } from "react-native-paper";
import { ListItem } from "react-native-elements";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";

function AudiobookAccordionList(props) {
  return (
    <List.Accordion
      titleStyle={styles.accordionTitleStyle}
      style={styles.accordionStyle}
      accessibilityLabel={props.audiobookTitle}
      theme={{ colors: { text: "white" } }}
    >
      <List.Section style={styles.accordianItemsStyle}>
        <ListItem.Subtitle style={styles.accordianItemsStyle}>
          <MaterialIconCommunity
            name="format-title"
            size={20}
          ></MaterialIconCommunity>
          {": "}
          {props.audiobookTitle}
        </ListItem.Subtitle>
        <Divider />

        <ListItem.Subtitle style={styles.accordianItemsStyle}>
          <MaterialIconCommunity
            name="feather"
            size={20}
          ></MaterialIconCommunity>
          {": "}
          {props.audiobookAuthorFirstName} {props.audiobookAuthorLastName}
        </ListItem.Subtitle>
        <Divider />

        <ListItem.Subtitle style={styles.accordianItemsStyle}>
          <MaterialIconCommunity
            name="timer-sand"
            size={20}
          ></MaterialIconCommunity>
          {": "}
          {props.audiobookTotalTime}
        </ListItem.Subtitle>
        <Divider />

        <ListItem.Subtitle style={styles.accordianItemsStyle}>
          <MaterialIconCommunity
            name="copyright"
            size={20}
          ></MaterialIconCommunity>
          {": "}
          {props.audiobookCopyrightYear}
        </ListItem.Subtitle>
        <Divider />
      </List.Section>
    </List.Accordion>
  );
}

// <ListItem.Subtitle style={styles.accordianItemsStyle}>
// <MaterialIconCommunity
// name="guy-fawkes-mask"
// size={20}
// ></MaterialIconCommunity>
// {": "}
// {JSON.parse(props.audiobookGenres).map((genre) => {
// return `${genre.name} `;
// })}
// </ListItem.Subtitle>

export default AudiobookAccordionList;

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  accordionStyle: {
    flex: 1,
    color: "white",
    backgroundColor: "#331800",
    width: windowWidth / 2 - 8,
    justifyContent: "center",
    height: 50,
  },
  accordionTitleStyle: {
    color: "black",
    backgroundColor: "#331800",
    width: windowWidth / 2 - 8,
    flex: 1,
    height: 40,
  },
  accordianItemsStyle: {
    color: "white",
    backgroundColor: "#51361a",
    width: windowWidth / 2 - 15,
  },
});
