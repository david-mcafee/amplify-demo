import { Flex } from '@aws-amplify/ui-react';

type ViewportProps = {};

const Viewport: React.FC<ViewportProps> = ({ children }) => {
	return (
		<Flex
			direction="column"
			minHeight={'100vh'}
			width={'100vw'}
			backgroundColor={'#F3F3F3'}
			alignItems={'center'}
			padding={'2rem'}
		>
			{children}
		</Flex>
	);
};

export default Viewport;
