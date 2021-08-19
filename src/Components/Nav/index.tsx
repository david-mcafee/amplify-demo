import React from "react";
import { Link } from "react-router-dom";
import { Button, Menu } from "semantic-ui-react";
import { Analytics } from "aws-amplify";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import { useStyles } from "./styles";

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
    <Menu className={navContainer}>
      <Menu.Item header>{`Welcome ${username}!`}</Menu.Item>
      <Menu.Item>
        <Link to="/">DataStore</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/chatbot">Chatbot</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/lambda">Lambda</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/pubsub">PubSub</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/storage">Storage</Link>
      </Menu.Item>
      <Menu.Item>
        <Button onClick={testAnalyticsButton}>Test Analytics</Button>
      </Menu.Item>
      <Menu.Item>
        <AmplifySignOut />
      </Menu.Item>
    </Menu>
  );
};

export default Nav;
