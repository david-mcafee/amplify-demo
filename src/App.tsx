import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Analytics, Auth } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import Loader from './Components/Loader';
import Viewport from './Components/Viewport';
import Nav from './Components/Nav';
import ErrorBoundary from './Components/ErrorBoundary';
import { AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { theme } from './theme';

const Home = React.lazy(() => import('./Components/Home'));
const DataStore = React.lazy(() => import('./Components/DataStore'));
const Storage = React.lazy(() => import('./Components/Storage'));
const AnalyticsComponent = React.lazy(() => import('./Components/Analytics'));

Auth.currentCredentials().then(info => {
	const cognitoIdentityId = info.identityId;
	console.log(cognitoIdentityId);
});

Analytics.autoTrack('session', {
	enable: true,
	attributes: {
		attr: 'attr',
	},
	provider: 'AWSPinpoint',
});

Analytics.autoTrack('pageView', {
	enable: true,
	eventName: 'pageView',
	attributes: {
		attr: 'attr',
	},
	type: 'multiPageApp',
	provider: 'AWSPinpoint',
	getUrl: () => {
		return window.location.origin + window.location.pathname;
	},
});

const App = () => {
	return (
		<Authenticator>
			{({ signOut, user }) => (
				<AmplifyProvider theme={theme}>
					<Router>
						<div>
							<Nav signOut={signOut} user={user} />
							<Viewport>
								<Switch>
									<Route exact path="/">
										<React.Suspense fallback={<Loader />}>
											<ErrorBoundary>
												<Home />
											</ErrorBoundary>
										</React.Suspense>
									</Route>
									<Route exact path="/DataStore">
										<React.Suspense fallback={<Loader />}>
											<ErrorBoundary>
												<DataStore />
											</ErrorBoundary>
										</React.Suspense>
									</Route>
									<Route path="/storage">
										<React.Suspense fallback={<Loader />}>
											<ErrorBoundary>
												<Storage />
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
			)}
		</Authenticator>
	);
};

export default App;
