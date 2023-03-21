import { Alert } from "@aws-amplify/ui-react";

const Banner = () => {
  return (
    <Alert isDismissible={true} hasIcon={true} heading="Amplify Demo ">
      Used for testing and debugging (i.e. subject to break, a lot)
    </Alert>
  );
};

export default Banner;
