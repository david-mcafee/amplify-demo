import { Analytics } from "aws-amplify";
import { AmplifySignOut } from "@aws-amplify/ui-react/legacy";
// import { useStyles } from "./styles";
import { Link } from "react-router-dom";
import { Button } from "@aws-amplify/ui-react";
import { Card, Flex } from "@aws-amplify/ui-react";

type NavProps = {
  readonly username: string;
};

const Nav = ({ username }: NavProps) => {
  // const { navContainer } = useStyles();

  function testAnalyticsButton() {
    Analytics.record({
      name: "test button click",
      metrics: { clickNumber: 1 },
    });
  }

  // <div className={navContainer}>
  return (
    <Card width={"100%"}>
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <div>{`Welcome ${username}!`}</div>
        <Flex alignItems="center" justifyContent="center">
          <Link to="/">GraphQL API</Link>
          <Link to="/chatbot">Chatbot</Link>
          <Link to="/lambda">Lambda</Link>
          <Link to="/pubsub">PubSub</Link>
          <Link to="/storage">Storage</Link>
          <Link to="/amplify-ui">Amplify UI</Link>
          <Button onClick={testAnalyticsButton}>Test Analytics</Button>
        </Flex>
        <AmplifySignOut />
      </Flex>
    </Card>
  );
};

export default Nav;
