import React from "react";
import { SearchBar } from "react-native-elements";
import AudioBooks from "../components/Audiobooks";
import { View } from "react-native";

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
        <View>
          <AudioBooks searchBarInput={search} />
        </View>
      </View>
    );
  }
}

export default Search;
