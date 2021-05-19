import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/Homescreen";
import AudioTracks from "./src/screens/Audiotracks";


const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    Audio: AudioTracks,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      title: "",
      headerShown:false,
    },
  } 
);


export default createAppContainer(navigator);
