import { useEffect, useState } from "react";
import { Analytics } from "aws-amplify";
import { Card, Heading, Button } from "@aws-amplify/ui-react";

const initialState = "Loading...";

const Analytics = () => {
  const [response, setResponse] = useState(initialState);

  useEffect(() => {
    // callLambda();
  }, []);

  return (
    <Card>
      <Heading as="h1">Analytics Test</Heading>
    </Card>
  );
};

export default Lambda;
