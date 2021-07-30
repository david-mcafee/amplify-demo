import React from "react";
import Todo from "./Todo.js";
import Chatbot from "./Chatbot.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Button, Menu } from "semantic-ui-react";
import Amplify, { Analytics } from "aws-amplify";
import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

const App = () => {
  function testAnalyticsButton() {
    Analytics.record({
      name: "test button click",
      metrics: { clickNumber: 1 },
    });
  }

  return (
    <Router>
      <div>
        <Menu>
          <Menu.Item header>Amplify Demo!</Menu.Item>
          <Menu.Item>
            <Link to="/">Todo</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/chatbot">Chatbot</Link>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={testAnalyticsButton}>Test Analytics</Button>
          </Menu.Item>
          <Menu.Item position="right">
            <AmplifySignOut />
          </Menu.Item>
        </Menu>

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Todo />
          </Route>
          <Route path="/chatbot">
            <Chatbot />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default withAuthenticator(App);
