import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { useStyles } from "./styles";

const LoaderDemo = () => {
  const { container } = useStyles();

  return (
    <Dimmer active className={container}>
      <Loader />
    </Dimmer>
  );
};

export default LoaderDemo;
