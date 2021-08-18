import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Header,
  Input,
  List,
  ListItem,
  ListContent,
  ListHeader,
  ListDescription,
} from "semantic-ui-react";

import { v4 as uuidv4 } from "uuid";

import Amplify, { PubSub } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub";

import UserContext from "../UserContext";

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
  readonly username: string;
};

const initialFormState = { message: "" };
const initialMessageState: Array<Message> = [];

const PubSubDemo = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [messages, setMessages] = useState(initialMessageState);

  const userContext = useContext(UserContext);

  function onMessageReceived(data: any) {
    if (data?.value?.msg) {
      const messageId = uuidv4();
      setMessages((messages) => {
        return [
          ...messages,
          {
            id: messageId,
            message: data?.value?.msg,
            username: data?.value?.author,
          },
        ];
      });
    } else {
      console.log("Error:", data);
    }
  }

  useEffect(() => {
    PubSub.subscribe("myTopic1").subscribe({
      next: (data) => onMessageReceived(data),
      error: (error) => console.error("subscription error", error),
      // TODO: docs are also incorrect here:
      // closed: () => console.log("Done"),
      // Should be:
      complete: () => console.log("Done"),
    });
  }, []);

  async function addMessage() {
    try {
      if (!formState.message) return;

      const message = formState.message;

      setFormState(initialFormState);

      await PubSub.publish("myTopic1", {
        author: userContext?.user?.username,
        msg: message,
      });
    } catch (err) {
      console.log("error publishing message", err);
    }
  }

  function setInput(key: string, value: string) {
    setFormState({ ...formState, [key]: value });
  }

  return (
    <Container>
      <Container>
        <Header as="h1">
          Sign-in with a second account in another browser to test the chat!
        </Header>
        <Container>
          <Input
            onChange={(event) => setInput("message", event.target.value)}
            value={formState.message}
            placeholder="Message"
          />
          <Button onClick={addMessage}>Add message</Button>
        </Container>
        <List>
          {messages?.map((message, index) => (
            <ListItem key={index}>
              <ListContent>
                <ListHeader>
                  <p>{message?.message}</p>
                </ListHeader>
                <ListDescription>
                  <p>{message?.username}</p>
                </ListDescription>
              </ListContent>
            </ListItem>
          ))}
        </List>
      </Container>
    </Container>
  );
};

export default PubSubDemo;
