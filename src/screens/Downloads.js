
import React from "react";
import { StyleSheet,View, Text } from "react-native";
import ButtonPanel from "../components/ButtonPanel";
function App() {
  const greeting = "Feature not yet implemented. Downloading of Audiobooks coming in a future version...";
  return (
    <View>
      <Text style={styles.messageStyle}>{greeting}</Text>
          <View styles={styles.buttonStyle}>
            <ButtonPanel buttonPressedIndex={2} />
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageStyle: {
    marginTop: 46,
    fontSize:20,
    padding:35,
    borderWidth:3,
    borderStyle:"solid",
  },
  buttonStyle: {
    paddingTop: 0,
  },
});

export default App;
