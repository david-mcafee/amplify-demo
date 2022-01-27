import React from "react";
import { Analytics } from "aws-amplify";
import { AmplifySignOut } from "@aws-amplify/ui-react/legacy";
import { useStyles } from "./styles";
import { Link } from "react-router-dom";
import { Button } from "@aws-amplify/ui-react";

type NavProps = {
  readonly username: string;
};

const Nav = ({ username }: NavProps) => {
  const { navContainer } = useStyles();

  function testAnalyticsButton() {
    Analytics.record({
      name: "test button click",
      metrics: { clickNumber: 1 },
    });
  }

  return (
    <div className={navContainer}>
      <div>{`Welcome ${username}!`}</div>
      <Link to="/">GraphQL API</Link>
      <Link to="/chatbot">Chatbot</Link>
      <Link to="/lambda">Lambda</Link>
      <Link to="/pubsub">PubSub</Link>
      <Link to="/storage">Storage</Link>
      <Link to="/amplify-ui">Amplify UI</Link>
      <Button onClick={testAnalyticsButton}>Test Analytics</Button>
      <AmplifySignOut />
    </div>
  );
};

export default Nav;
