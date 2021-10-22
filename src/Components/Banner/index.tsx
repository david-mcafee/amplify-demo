// import { Container } from "semantic-ui-react";
import { useStyles } from "./styles";

const Banner = () => {
  const { banner } = useStyles();

  return (
    <div className={banner}>
      <h5>
        Amplify demo used for testing and debugging (i.e. subject to break, a
        lot)
      </h5>
    </div>
  );
};

export default Banner;
