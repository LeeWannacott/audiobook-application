import React from "react";
import { SearchBar } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import ButtonPanel from "../components/ButtonPanel";

class Search extends React.Component {
  state = {
    search: "",
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;
    return (
      <View>
        <SearchBar
          placeholder="Search for AudioBook.."
          onChangeText={this.updateSearch}
          value={search}
        />
        <React.Fragment>
          <AudioBooks searchBarInput={search} />
        </React.Fragment>
      </View>
    );
  }
}

export default Search;
