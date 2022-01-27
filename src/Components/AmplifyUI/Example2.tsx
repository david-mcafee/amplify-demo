import { Card, Text, Flex, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const Example2 = () => {
  return (
    <Card>
      <Flex direction={{ base: "column", large: "row" }}>
        <View
          width="100%"
          backgroundColor={{ base: "orange", large: "yellow" }}
        >
          Hello
        </View>
        <View
          width="100%"
          backgroundColor={["orange", "orange", "orange", "yellow"]}
        >
          there!
        </View>
      </Flex>
      <View
        color={{
          base: "black",
          small: "black",
          medium: "black",
          large: "white",
          xl: "white",
          xxl: "white",
        }}
        backgroundColor={{
          base: "red",
          small: "orange",
          medium: "yellow",
          large: "green",
          xl: "blue",
          xxl: "purple",
        }}
      >
        Hello
      </View>
      <Text
        as="span"
        fontSize={["1rem", "2rem", "3rem", "4rem", "5rem", "6rem"]}
        lineHeight="normal"
      >
        {" 🐈 "}
      </Text>
      <Text as="span" fontSize={["1rem", "2rem", "3rem"]} lineHeight="normal">
        {" 🐕 "}
      </Text>
    </Card>
  );
};

export default Example2;
