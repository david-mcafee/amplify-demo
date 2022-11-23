import { Link } from 'react-router-dom';
import {
	Badge,
	Button,
	Card,
	Divider,
	Flex,
	View,
} from '@aws-amplify/ui-react';
import Banner from '../Banner';

type NavProps = {
	signOut: any;
	user: any;
};

const Nav = ({ signOut, user }: NavProps) => {
	return (
		<View position={'sticky'} top={0}>
			<Banner />
			<Card width={'100%'} variation={'elevated'}>
				<Flex
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Badge variation="info">{`Welcome ${user?.username}!`}</Badge>
					<Divider orientation="vertical" />
					<Flex alignItems="center" justifyContent="center">
						<Link to="/">Home</Link>
						<Divider orientation="vertical" />
						<Link to="/DataStore">DataStore</Link>
						<Divider orientation="vertical" />
						<Link to="/storage">Storage</Link>
						<Divider orientation="vertical" />
						<Link to="/analytics">Analytics Test</Link>
					</Flex>
					<Divider orientation="vertical" />
					<Button onClick={signOut}>Sign out</Button>
				</Flex>
			</Card>
		</View>
	);
};

export default Nav;
