import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoaderDemo = () => (
  <Dimmer active style={styles.container}>
    <Loader />
  </Dimmer>
);

export default LoaderDemo;

type Styles = {
  container: React.CSSProperties;
};

const styles: Styles = {
  container: {
    width: "100%",
    height: "100%",
  },
};
