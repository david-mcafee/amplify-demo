import { View, Grid } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import Example1 from "./Example1";
import Example2 from "./Example2";

// import { theme } from "./theme";

const Example = () => {
  return (
    <View>
      <Grid
        templateColumns={{ base: "1fr", large: "1fr 3fr" }}
        templateRows={{ base: "repeat(4, 10rem)", large: "repeat(3, 10rem)" }}
        gap="var(--amplify-space-small)"
      >
        <View
          columnSpan={[1, 1, 1, 2]}
          backgroundColor="var(--amplify-colors-pink-10)"
        ></View>
        <View
          rowSpan={{ base: 1, large: 2 }}
          backgroundColor="var(--amplify-colors-pink-20)"
        >
          <Example2 />
        </View>
        <View backgroundColor="var(--amplify-colors-pink-40)">
          <Example1 />
        </View>
        <View backgroundColor="var(--amplify-colors-pink-60)"></View>
      </Grid>
    </View>
  );
};

export default function App() {
  return <Example />;
}
