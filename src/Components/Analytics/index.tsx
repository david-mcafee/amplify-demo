import { useState } from "react";
import { Analytics } from "aws-amplify";
import { Button, Card, Heading, Flex } from "@aws-amplify/ui-react";

const AnalyticsComponent = () => {
  const [formAttribute, setFormAttribute] = useState("");
  const [updateResponses, setUpdateResponses] = useState([]);
  const [eventResponses, setEventResponses] = useState([]);

  const updateEndpoint = async () => {
    try {
      if (!formAttribute) {
        return;
      }

      const result: any = await Analytics.updateEndpoint({
        attributes: {
          test: [formAttribute],
        },
      });

      setUpdateResponses((prev) => [...prev, result] as any);
    } catch (err) {
      console.log("Error updating endpoint: ", err);
    }
  };

  const sendEventWithCustomAttribute = async () => {
    try {
      const result: any = await Analytics.record({
        name: "test-event",
        attributes: {
          test: ["test3"],
        },
      });

      setEventResponses((prev) => [...prev, result] as any);
    } catch (err) {
      console.log("Error sending event: ", err);
    }
  };

  const sendBasicEvent = async () => {
    try {
      const result: any = await Analytics.record({
        name: "test-event",
      });

      setEventResponses((prev) => [...prev, result] as any);
    } catch (err) {
      console.log("Error sending basic event: ", err);
    }
  };

  return (
    <Card variation={"elevated"}>
      <Flex direction={"column"}>
        <Heading as="h1">Analytics Test</Heading>
        <a
          href="https://github.com/david-mcafee/amplify-demo/blob/main/src/Components/Analytics/index.tsx"
          target="_blank"
          rel="noreferrer noopener"
        >
          View source code
        </a>
        <input
          onChange={(event) => setFormAttribute(event.target.value)}
          value={formAttribute}
          placeholder="Attribute"
        />
        <Button variation="primary" onClick={sendBasicEvent}>
          Send Basic Event
        </Button>
        <Button variation="primary" onClick={updateEndpoint}>
          Update Endpoint with Custom Attribute
        </Button>
        <Button variation="primary" onClick={sendEventWithCustomAttribute}>
          Send Event with Custom Attribute
        </Button>
        <pre>Update Responses: {JSON.stringify(updateResponses, null, 2)}</pre>
        <pre>Event Responses: {JSON.stringify(eventResponses, null, 2)}</pre>
      </Flex>
    </Card>
  );
};

export default AnalyticsComponent;
