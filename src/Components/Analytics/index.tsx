import { useState } from "react";
import { Analytics } from "aws-amplify";
import { Button, Card, Heading, Flex } from "@aws-amplify/ui-react";

type InitialFormState = {
  readonly attrKey: string;
  readonly attrValue: string;
};

const initialFormState: InitialFormState = { attrKey: "", attrValue: "" };

const AnalyticsComponent = () => {
  const [formAttributes, setFormAttributes] = useState(initialFormState);
  const [updateResponses, setUpdateResponses] = useState([]);
  const [eventResponses, setEventResponses] = useState([]);

  function setInput(key: string, value: string) {
    setFormAttributes({ ...formAttributes, [key]: value });
  }

  const updateEndpoint = async () => {
    try {
      if (!formAttributes.attrKey || !formAttributes.attrValue) {
        return;
      }

      const attributesPayload: any = {};
      attributesPayload[formAttributes.attrKey] = [formAttributes.attrValue];

      console.log(attributesPayload);

      const result: any = await Analytics.updateEndpoint({
        attributes: attributesPayload,
      });

      setUpdateResponses((prev) => [...prev, result] as any);
    } catch (err) {
      console.log("Error updating endpoint: ", err);
    }
  };

  const sendEventWithCustomAttribute = async () => {
    try {
      const attributesPayload: any = {};
      attributesPayload[formAttributes.attrKey] = formAttributes.attrValue;

      const result: any = await Analytics.record({
        name: "test-event",
        attributes: attributesPayload,
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
          onChange={(event) => setInput("attrKey", event.target.value)}
          value={formAttributes.attrKey}
          placeholder="Attribute key"
        />
        <input
          onChange={(event) => setInput("attrValue", event.target.value)}
          value={formAttributes.attrValue}
          placeholder="Attribute value"
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
