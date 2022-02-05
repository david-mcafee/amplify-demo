// import { Analytics } from "aws-amplify";
// import { AmplifySignOut } from "@aws-amplify/ui-react/legacy";
// import { useStyles } from "./styles";
// import { Link } from "react-router-dom";
// import { Button, Card, Divider, Flex, View } from "@aws-amplify/ui-react";
import { Flex } from "@aws-amplify/ui-react";

type ViewportProps = {};

const Viewport: React.FC<ViewportProps> = ({ children }) => {
  return (
    <Flex
      direction="column"
      minHeight={"100vh"}
      width={"100vw"}
      backgroundColor={"rgb(159, 255, 128)"}
      alignItems={"center"}
      padding={"2rem"}
    >
      {children}
    </Flex>
  );
};

export default Viewport;

// rgb light grey
// rgb(245, 245, 245)
