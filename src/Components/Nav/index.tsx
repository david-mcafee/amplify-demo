import { Analytics } from "aws-amplify";
import { AmplifySignOut } from "@aws-amplify/ui-react/legacy";
// import { useStyles } from "./styles";
import { Link } from "react-router-dom";
import { Button, Card, Divider, Flex } from "@aws-amplify/ui-react";

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
        <Divider orientation="vertical" />
        <Flex alignItems="center" justifyContent="center">
          <Link to="/">GraphQL API</Link>
          <Divider orientation="vertical" />
          <Link to="/chatbot">Chatbot</Link>
          <Divider orientation="vertical" />
          <Link to="/lambda">Lambda</Link>
          <Divider orientation="vertical" />
          <Link to="/pubsub">PubSub</Link>
          <Divider orientation="vertical" />
          <Link to="/storage">Storage</Link>
          <Divider orientation="vertical" />
          <Link to="/amplify-ui">Amplify UI</Link>
          <Divider orientation="vertical" />
          <Button onClick={testAnalyticsButton}>Test Analytics</Button>
        </Flex>
        <Divider orientation="vertical" />
        <AmplifySignOut />
      </Flex>
    </Card>
  );
};

export default Nav;
