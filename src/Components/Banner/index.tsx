// import { Container } from "semantic-ui-react";
// import { useStyles } from "./styles";
import { Alert } from '@aws-amplify/ui-react';

const Banner = () => {
	// const { banner } = useStyles();

	return (
		<Alert
			isDismissible={true}
			hasIcon={true}
			heading="Amplify Smoke Testing App"
		>
			Navigate through each component to view testing instructions
		</Alert>
	);
};

export default Banner;
