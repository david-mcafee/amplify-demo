import React from "react";
import { Progress } from "semantic-ui-react";

type ProgressExampleProps = {
  readonly uploadProgress: number;
};

const ProgressExample = ({ uploadProgress }: ProgressExampleProps) => (
  <Progress percent={uploadProgress} indicating={uploadProgress !== 0} />
);

export default ProgressExample;
