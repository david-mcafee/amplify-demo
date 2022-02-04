// import { Analytics } from "aws-amplify";
// import { AmplifySignOut } from "@aws-amplify/ui-react/legacy";
// import { useStyles } from "./styles";
// import { Link } from "react-router-dom";
// import { Button, Card, Divider, Flex, View } from "@aws-amplify/ui-react";
import { View } from "@aws-amplify/ui-react";

type ViewportProps = {};

const Viewport: React.FC<ViewportProps> = ({ children }) => {
  return (
    <View
      direction="column"
      height={"100%"}
      width={"100%"}
      backgroundColor={"red"}
    >
      {children}
    </View>
  );
};

export default Viewport;
