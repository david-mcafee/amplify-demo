import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { ChatResult } from "@aws-amplify/ui-components/dist/types/common/types/interactions-types";
import { createAppointment, deleteAppointment } from "../graphql/mutations";
import { listAppointments } from "../graphql/queries";
import { AmplifyChatbot } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  List,
  ListContent,
  ListItem,
  ListHeader,
  ListDescription,
} from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
// import { createAppointment } from "./graphql/mutations";

Amplify.configure(awsconfig);

type Appointment = {
  readonly id: string;
  readonly name: string;
  readonly time: string;
  readonly owner: string;
};

const appointmentsInitialState: Array<Appointment> = [];

const Chatbot = () => {
  const [appointments, setAppointments] = useState(appointmentsInitialState);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      // TODO: add type
      const appointmentsData: any = await API.graphql(
        graphqlOperation(listAppointments)
      );
      const appointments = appointmentsData.data.listAppointments.items;
      setAppointments(appointments);
    } catch (err) {}
  }

  async function addAppointment(appointment: Appointment) {
    try {
      setAppointments([...appointments, appointment]);
      await API.graphql(
        graphqlOperation(createAppointment, { input: { ...appointment } })
      );
    } catch (err) {
      // If there was an error, fetch appointments because local state is not correct
      fetchAppointments();
      console.log("error creating appointment:", err);
    }
  }

  const handleChatComplete = (event: CustomEvent<ChatResult>) => {
    const { data, err } = event.detail;
    if (data) {
      console.log("Chat fulfilled!", JSON.stringify(data));
      // TODO
      // @ts-ignore
      const appointmentData = data.slots;
      const appointmentType = appointmentData?.AppointmentType;
      const appointmentDate = appointmentData?.Date;
      const appointmentTime = appointmentData?.Time;
      const appointmentOwner = appointmentData?.Owner;
      // Generate id so that you can optimistically update state, while still allowing
      // for update and delete, since those require ids. Alternative is to fetch
      // on each operation, but that's slow.
      const appointmentId = uuidv4();

      const appointment = {
        id: appointmentId,
        name: appointmentType,
        time: `${appointmentDate} at ${appointmentTime}`,
        owner: appointmentOwner,
      };

      addAppointment(appointment);
    }
    if (err) console.error("Chat failed:", err);
  };

  useEffect(() => {
    const chatbotElement = document.querySelector("amplify-chatbot");
    // TODO
    // @ts-ignore
    chatbotElement.addEventListener("chatCompleted", handleChatComplete);
    return function cleanup() {
      // TODO
      // @ts-ignore
      chatbotElement.removeEventListener("chatCompleted", handleChatComplete);
    };
  }, []);

  async function removeAppointment(appointmentId: string) {
    try {
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
      await API.graphql(
        graphqlOperation(deleteAppointment, { input: { id: appointmentId } })
      );
    } catch (err) {
      // If there was an error, fetch appointments because local state is not correct
      fetchAppointments();
    }
  }

  return (
    <Container style={styles.parentContainer}>
      <Container>
        <AmplifyChatbot
          botName="ScheduleAppointment_dev"
          botTitle="Appointment booking"
          welcomeMessage="Hello, would you like to schedule an appointment?"
          conversationModeOn
          textEnabled
          voiceEnabled
        />
      </Container>
      <Divider />
      <Container>
        <Header as="h1">Current Appointments:</Header>
        <List>
          {appointments.map((appointment, index) => (
            <ListItem key={appointment.id ? appointment.id : index}>
              <ListHeader>
                <p>{appointment.name}</p>
              </ListHeader>
              <ListDescription>
                <p>{appointment.owner}</p>
              </ListDescription>
              <ListDescription>
                <p>{appointment.time}</p>
              </ListDescription>
              <ListContent>
                <Button
                  onClick={() => removeAppointment(appointment.id)}
                  icon
                  circular
                >
                  <Icon name="delete" color="red" />
                </Button>
              </ListContent>
            </ListItem>
          ))}
        </List>
      </Container>
    </Container>
  );
};

type Styles = {
  parentContainer: React.CSSProperties;
};

const styles = {
  parentContainer: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "space-between",
    justifyContent: "center",
    padding: 20,
  },
};

export default Chatbot;
