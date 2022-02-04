// import { Container } from "semantic-ui-react";
// import { useStyles } from "./styles";
import { Alert } from "@aws-amplify/ui-react";

const Banner = () => {
  // const { banner } = useStyles();

  return (
    <Alert isDismissible={true} hasIcon={true} heading="Amplify Demo ">
      Used for testing and debugging (i.e. subject to break, a lot)
    </Alert>
  );
};

export default Banner;
