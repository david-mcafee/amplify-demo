const Home = () => {
	return (
		<div>
			<h1>Amplify Smoke Testing App</h1>
			<p>
				The MCM technician will manually smoke test basic functionality using
				this app. Test cases are documented here. When the changes included in
				the current release update our interaction with a browser API, these
				changes must also be tested against Chrome, Firefox, Safari, and Edge.
			</p>
			<h2>While testing, always perform the following:</h2>
			<ol>
				<li>Update each browser to the latest version</li>
				<li>Keep the console open while testing, and check for errors</li>
				<li>Test online / offline</li>
			</ol>
		</div>
	);
};

export default Home;
