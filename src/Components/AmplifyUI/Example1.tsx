// TODO: remove `createTheme`, `View`, and `Rating` from docs, add `alt` to Image

import {
  Button,
  Card,
  Text,
  Heading,
  Flex,
  Badge,
  Image,
  StepperField,
  useTheme,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const Example1 = () => {
  const { tokens } = useTheme();
  return (
    <Card>
      <Flex direction="row" alignItems="flex-start">
        <Image
          alt="test"
          src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=930&q=80"
          width="8rem"
        />
        <Flex direction="column" gap={tokens.space.xs}>
          <Flex direction="row">
            <Badge variation="success">New</Badge>
          </Flex>
          <Heading level={3}>Product title</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
            scelerisque risus in sem dapibus, nec vestibulum metus mattis.
            Mauris dignissim maximus tellus, in feugiat nibh rhoncus a. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque
            risus in sem dapibus, nec vestibulum metus mattis. Mauris dignissim
            maximus tellus, in feugiat nibh rhoncus a. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Ut scelerisque risus in sem
            dapibus, nec vestibulum metus mattis. Mauris dignissim maximus
            tellus, in feugiat nibh rhoncus a. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Ut scelerisque risus in sem dapibus,
            nec vestibulum metus mattis. Mauris dignissim maximus tellus, in
            feugiat nibh rhoncus a. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Ut scelerisque risus in sem dapibus, nec vestibulum
            metus mattis. Mauris dignissim maximus tellus, in feugiat nibh
            rhoncus a.
          </Text>
          <Flex direction="row" alignItems="center">
            <Text
              fontSize={tokens.fontSizes.large}
              color={tokens.colors.font.secondary}
            >
              $199.99
            </Text>
            <StepperField
              label="Stepper"
              defaultValue={1}
              min={0}
              max={10}
              step={1}
              labelHidden
            />
            <Button variation="primary">Add to cart</Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Example1;
