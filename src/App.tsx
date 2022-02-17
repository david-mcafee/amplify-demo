import React, { useReducer, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify, { Analytics, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react/legacy";
import UserContext from "./UserContext";
import Loader from "./Components/Loader";
import Viewport from "./Components/Viewport";
import Nav from "./Components/Nav";
import ErrorBoundary from "./Components/ErrorBoundary";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { theme } from "./theme";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const TodoHome = React.lazy(() => import("./Components/Todo"));
// const Chatbot = React.lazy(() => import("./Components/Chatbot"));
const Lambda = React.lazy(() => import("./Components/Lambda"));
const PubSub = React.lazy(() => import("./Components/PubSub"));
const Storage = React.lazy(() => import("./Components/Storage"));
const AmplifyUI = React.lazy(() => import("./Components/AmplifyUI"));
const AnalyticsComponent = React.lazy(() => import("./Components/Analytics"));

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
    <AmplifyProvider theme={theme}>
      <Router>
        <div>
          <Nav username={userState?.user?.username} />
          {/* <Divider orientation="horizontal" /> */}
          {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
          <Viewport>
            <Switch>
              <Route exact path="/">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <TodoHome />
                  </ErrorBoundary>
                </React.Suspense>
              </Route>
              {/* <Route path="/chatbot">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <Chatbot />
                  </ErrorBoundary>
                </React.Suspense>
              </Route> */}
              <Route path="/lambda">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <Lambda />
                  </ErrorBoundary>
                </React.Suspense>
              </Route>
              <Route path="/pubsub">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <PubSub />
                  </ErrorBoundary>
                  <UserContext.Provider
                    value={userState}
                  ></UserContext.Provider>
                </React.Suspense>
              </Route>
              <Route path="/storage">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <Storage />
                  </ErrorBoundary>
                </React.Suspense>
              </Route>
              <Route path="/amplify-ui">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <AmplifyUI />
                  </ErrorBoundary>
                </React.Suspense>
              </Route>
              <Route path="/analytics">
                <React.Suspense fallback={<Loader />}>
                  <ErrorBoundary>
                    <AnalyticsComponent />
                  </ErrorBoundary>
                </React.Suspense>
              </Route>
            </Switch>
          </Viewport>
        </div>
      </Router>
    </AmplifyProvider>
  );
};

export default withAuthenticator(App);
