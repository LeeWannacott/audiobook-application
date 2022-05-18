import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet,Dimensions} from "react-native";

function PickerForHistoryAndBookShelf(props) {
  console.log(props)
  const {
    pickerAndQueryState,
    getShelvedBooks,
    setPickerAndQueryState,
    storeAsyncData,
    toggleAscOrDescSort,
    Button,
    Picker,
    View,
    MaterialIconCommunity
  } = props;
  return (
    <View style={styles.SQLQueryPickerAndIcon}>
      <View style={styles.SQLQueryPicker}>
        <Picker
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
            storeAsyncData("pickerAndQueryData", {
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
            value="order by audiobook_total_time_secs + 0"
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
            value="order by audiobook_copyright_year + 0"
          />
          <Picker.Item
            label="Listening Progress"
            value="order by listening_progress_percent + 0"
          />
        </Picker>
      </View>
      <Button
        mode="contained"
        style={{
          backgroundColor: "black",
          height: 62,
          marginTop: 5,
          marginBottom: 5,
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
    marginLeft: 0,
  },
  SQLQueryPickerAndIcon: {
    display: "flex",
    flexDirection: "row",
  },
});
