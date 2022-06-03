import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons.js";
import { storeAsyncData } from "../database_functions";
import { useFonts } from "expo-font";

function PickerForHistoryAndBookShelf(props: any) {
  const {
    pickerAndQueryState,
    getShelvedBooks,
    setPickerAndQueryState,
    toggleAscOrDescSort,
    asyncDataKeyName,
  } = props;

  const [loaded] = useFonts({
    IBMPlexMono: require('../../assets/fonts/Helvetica.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.SQLQueryPickerAndIcon}>
      <View style={styles.SQLQueryPicker}>
        <Picker
          style={{fontFamily:"Helvetica",fontSize:90}}
          selectedValue={pickerAndQueryState.orderBy}
          mode={"dropdown"}
          dropdownIconRippleColor={"grey"}
          

          onValueChange={(itemValue, itemPosition) => {

            setPickerAndQueryState({
              ...pickerAndQueryState,
              orderBy: itemValue,
              pickerIndex: itemPosition,
            });
            getShelvedBooks({
              ...pickerAndQueryState,
              orderBy: itemValue,
              pickerIndex: itemPosition,
            });
            storeAsyncData(asyncDataKeyName, {
              ...pickerAndQueryState,
              orderBy: itemValue,
              pickerIndex: itemPosition,
            });
          }}
        >
          <Picker.Item label="Order Visited" value="order by id" />
          <Picker.Item label="Title" value="order by audiobook_title" />
          <Picker.Item label="Rating" value="order by audiobook_rating + 0" />
          <Picker.Item
            label="Total Time"
            value="order by audiobook_total_time_secs"
          />
          <Picker.Item
            label="Author First Name"
            value="order by audiobook_author_first_name"
          />
          <Picker.Item
            label="Author Last Name"
            value="order by audiobook_author_last_name"
          />
          <Picker.Item label="Language" value="order by audiobook_language" />
          <Picker.Item label="Genre" value="order by audiobook_genres" />
          <Picker.Item
            label="Copyright year"
            value="order by audiobook_copyright_year"
          />
          <Picker.Item
            label="Listening Progress"
            value="order by listening_progress_percent"
          />
        </Picker>
      </View>
      <Button
        mode="contained"
        style={{
          backgroundColor: "black",
          height: 62,
        }}
        onPress={() => {
          toggleAscOrDescSort();
        }}
      >
        <MaterialIconCommunity
          name={pickerAndQueryState.icon}
          size={40}
          color="white"
        />
      </Button>
    </View>
  );
}

export default PickerForHistoryAndBookShelf;

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  SQLQueryPicker: {
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: "white",
    width: windowWidth - 100,
    margin: 5,
    height:55,
    marginLeft: 0,
  },
  SQLQueryPickerAndIcon: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"black",
    height:80,
    paddingTop:10,
  },
});
