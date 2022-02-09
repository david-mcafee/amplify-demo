import { useStyles } from "./styles";
import { Loader } from "@aws-amplify/ui-react";

const LoaderDemo = () => {
  const { container } = useStyles();

  return (
    <div className={container}>
      <Loader size="large" />
    </div>
  );
};

export default LoaderDemo;
