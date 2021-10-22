import React, { useReducer, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify, { Analytics, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import UserContext from "./UserContext";
import Loader from "./Components/Loader";
import Nav from "./Components/Nav";
import Banner from "./Components/Banner";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const TodoHome = React.lazy(() => import("./Components/Todo"));
const Chatbot = React.lazy(() => import("./Components/Chatbot"));
const Lambda = React.lazy(() => import("./Components/Lambda"));
const PubSub = React.lazy(() => import("./Components/PubSub"));
const Storage = React.lazy(() => import("./Components/Storage"));

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

const initialState = { user: {} };

function reducer(userState: any, action: any) {
  switch (action.type) {
    case "addUser":
      return { user: action.user };
    default:
      throw new Error();
  }
}

Analytics.autoTrack("session", {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
  // OPTIONAL, the attributes of the event, you can either pass an object or a function
  // which allows you to define dynamic attributes
  attributes: {
    attr: "attr",
  },
  // when using function
  // attributes: () => {
  //    const attr = somewhere();
  //    return {
  //        myAttr: attr
  //    }
  // },
  // OPTIONAL, the service provider, by default is the Amazon Pinpoint
  provider: "AWSPinpoint",
});

Analytics.autoTrack("pageView", {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
  // OPTIONAL, the event name, by default is 'pageView'
  eventName: "pageView",
  // OPTIONAL, the attributes of the event, you can either pass an object or a function
  // which allows you to define dynamic attributes
  attributes: {
    attr: "attr",
  },
  // when using function
  // attributes: () => {
  //    const attr = somewhere();
  //    return {
  //        myAttr: attr
  //    }
  // },
  // OPTIONAL, by default is 'multiPageApp'
  // you need to change it to 'SPA' if your app is a single-page app like React
  type: "multiPageApp",
  // OPTIONAL, the service provider, by default is the Amazon Pinpoint
  provider: "AWSPinpoint",
  // OPTIONAL, to get the current page url
  getUrl: () => {
    // the default function
    return window.location.origin + window.location.pathname;
  },
});

const App = () => {
  const [userState, dispatch] = useReducer(reducer, initialState);

  async function getUser() {
    let response;

    try {
      response = await Auth.currentAuthenticatedUser();
    } catch (err) {
      console.log("error getting current user");
    } finally {
      dispatch({ type: "addUser", user: { username: response?.username } });
    }
  }

  useEffect(() => {
    getUser();
    Auth.currentCredentials().then((info) => {});
  }, []);

  return (
    <Router>
      <div>
        <Banner />
        <Nav username={userState?.user?.username} />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <React.Suspense fallback={<Loader />}>
              <TodoHome />
            </React.Suspense>
          </Route>
          <Route path="/chatbot">
            <React.Suspense fallback={<Loader />}>
              <Chatbot />
            </React.Suspense>
          </Route>
          <Route path="/lambda">
            <React.Suspense fallback={<Loader />}>
              <Lambda />
            </React.Suspense>
          </Route>
          <Route path="/pubsub">
            <React.Suspense fallback={<Loader />}>
              <UserContext.Provider value={userState}>
                <PubSub />
              </UserContext.Provider>
            </React.Suspense>
          </Route>
          <Route path="/storage">
            <React.Suspense fallback={<Loader />}>
              <Storage />
            </React.Suspense>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default withAuthenticator(App);
