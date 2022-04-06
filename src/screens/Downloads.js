import React from "react";
import { StyleSheet, View, Text } from "react-native";
function App() {
  const greeting =
    "Feature not yet implemented. Downloading of Audiobooks coming in a future version...";
  return (
    <View>
      <Text style={styles.messageStyle}>{greeting}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageStyle: {
    marginTop: 46,
    fontSize: 20,
    padding: 35,
    borderWidth: 3,
    borderStyle: "solid",
  },
});

export default App;
