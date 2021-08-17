import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Header,
  Input,
  List,
  ListItem,
  ListContent,
} from "semantic-ui-react";

import { v4 as uuidv4 } from "uuid";

import Amplify, { Auth, PubSub } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub";

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "us-west-2",
    aws_pubsub_endpoint:
      "wss://acher2z8wvnbh-ats.iot.us-west-2.amazonaws.com/mqtt",
  })
);

// TODO:
// You can retrieve the Cognito Identity Id of a logged in user with Auth Module:
// https://docs.amplify.aws/lib/pubsub/getting-started/q/platform/js/#step-1-create-iam-policies-for-aws-iot

// TODO: update docs, this is incorrect:
// const cognitoIdentityId = info.data.IdentityId;
// Should be:
// const cognitoIdentityId = info.identityId;

type Message = {
  readonly id: string;
  readonly message: string;
};

const initialFormState = { message: "" };
const initialMessageState: Array<Message> = [{ id: "test", message: "test" }];

const PubSubDemo = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [messages, setMessages] = useState(initialMessageState);

  function onMessageReceived(data: any) {
    if (data?.value?.msg) {
      console.log("set message----------------");
      console.log(messages);
      const messageId = uuidv4();
      setMessages((messages) => {
        return [...messages, { id: messageId, message: data?.value?.msg }];
      });
    } else {
      console.log("data is missing---------", data);
    }
  }

  useEffect(() => {
    PubSub.subscribe("myTopic1").subscribe({
      next: (data) => onMessageReceived(data),
      // next: (data) => console.log(data),
      error: (error) => console.error("error subscribing----------", error),
      // TODO: docs are also incorrect here:
      // closed: () => console.log("Done"),
      // Should be:
      complete: () => console.log("Done"),
    });
  }, []);

  async function addMessage() {
    try {
      // debugger;
      if (!formState.message) return;

      const message = formState.message;

      setFormState(initialFormState);

      await PubSub.publish("myTopic1", { msg: message });
    } catch (err) {
      console.log("error publishing message", err);
    }
  }

  function setInput(key: string, value: string) {
    setFormState({ ...formState, [key]: value });
  }

  return (
    <Container>
      <Header as="h1">PubSub</Header>
      <Input
        onChange={(event) => setInput("message", event.target.value)}
        value={formState.message}
        placeholder="Message"
      />
      <Button onClick={addMessage}>Add message</Button>
      <List>
        {messages?.map((message, index) => (
          <ListItem key={index}>
            <ListContent>
              <p>{message.message}</p>
            </ListContent>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PubSubDemo;
