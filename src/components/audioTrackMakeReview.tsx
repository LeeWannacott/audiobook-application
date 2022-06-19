import { StyleSheet, Dimensions, TextInput, Text, View } from "react-native";
import { Overlay } from "react-native-elements";
import { Button } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

function MakeUserReview(props: any) {
  const {
    reviewInformation,
    setReviewInformation,
    makeReviewOptions,
    sendReviewToAPI,
    toggleWriteReviewOverlay,
    title,
  } = props;
  return (
    <View>
      <Overlay
        isVisible={makeReviewOptions}
        onBackdropPress={toggleWriteReviewOverlay}
        fullScreen={false}
        overlayStyle={{ backgroundColor: "#F9F6EE", width: windowWidth - 20 }}
      >
        <Text style={{ marginBottom: 5 }}>Title: {title}</Text>
        <Rating
          imageSize={40}
          ratingCount={5}
          startingValue={0}
          showRating={false}
          fractions={false}
          tintColor="#F9F6EE"
          type="custom"
          style={{ marginBottom: 5 }}
          ratingBackgroundColor="#E2DFD2"
          onFinishRating={(userRating: number) => {
            setReviewInformation({
              ...reviewInformation,
              reviewRating: userRating,
            });
          }}
        />
        <Text>Review Title:</Text>
        <TextInput
          style={styles.reviewerNameStyle}
          ref={(reviewTitleRef) => {
            reviewTitleRef;
          }}
          onChangeText={(reviewTitleRef) => {
            console.log(reviewTitleRef);
            setReviewInformation({
              ...reviewInformation,
              reviewTitle: reviewTitleRef,
            });
          }}
        ></TextInput>
        <Text>Review Text:</Text>

        <TextInput
          style={styles.reviewTextBodyStyle}
          ref={(reviewTextRef) => {
            reviewTextRef;
          }}
          onChangeText={(reviewTextRef) => {
            setReviewInformation({
              ...reviewInformation,
              reviewText: reviewTextRef,
            });
          }}
        ></TextInput>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text>Post review: </Text>
          <Button
            accessibilityLabel="Posts users review for the audiobook."
            mode={"outlined"}
            onPress={() => sendReviewToAPI()}
          >
            <MaterialIcons name="send" size={30} color="black" />
          </Button>
        </View>
      </Overlay>
    </View>
  );
}

export default MakeUserReview;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  reviewTextBodyStyle: {
    backgroundColor: "white",
    borderColor: "#000000",
    borderWidth: 1,
    height: windowHeight / 3,
    width: windowWidth - 40,
  },
  reviewerNameStyle: {
    backgroundColor: "white",
    borderColor: "#000000",
    borderWidth: 1,
    marginBottom: 5,
    width: windowWidth - 40,
  },
});
