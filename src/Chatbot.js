import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createAppointment } from "./graphql/mutations";
import { listAppointments } from "./graphql/queries";
import { AmplifyChatbot } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import {
  Container,
  Divider,
  Header,
  List,
  ListItem,
  ListHeader,
  ListDescription,
} from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
// import { createAppointment } from "./graphql/mutations";

Amplify.configure(awsconfig);

const Chatbot = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const appointmentsData = await API.graphql(
        graphqlOperation(listAppointments)
      );
      const appointments = appointmentsData.data.listAppointments.items;
      setAppointments(appointments);
    } catch (err) {}
  }

  async function addAppointment(appointment) {
    try {
      setAppointments([...appointments, appointment]);
      await API.graphql(
        graphqlOperation(createAppointment, { input: { ...appointment } })
      );
    } catch (err) {
      fetchAppointments();
      console.log("error creating appointment:", err);
    }
  }

  const handleChatComplete = (event) => {
    const { data, err } = event.detail;
    if (data) {
      console.log("Chat fulfilled!", JSON.stringify(data));
      const appointmentData = data.slots;
      const appointmentType = appointmentData?.AppointmentType;
      const appointmentDate = appointmentData?.Date;
      const appointmentTime = appointmentData?.Time;
      // Generate id so that you can optimistically update state, while still allowing
      // for update and delete, since those require ids. Alternative is to fetch
      // on each operation, but that's slow.
      const appointmentId = uuidv4();

      const appointment = {
        id: appointmentId,
        name: appointmentType,
        time: `${appointmentDate} at ${appointmentTime}`,
      };

      addAppointment(appointment);
    }
    if (err) console.error("Chat failed:", err);
  };

  useEffect(() => {
    const chatbotElement = document.querySelector("amplify-chatbot");
    chatbotElement.addEventListener("chatCompleted", handleChatComplete);
    return function cleanup() {
      chatbotElement.removeEventListener("chatCompleted", handleChatComplete);
    };
  }, []);

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
            </ListItem>
          ))}
        </List>
      </Container>
    </Container>
  );
};

const styles = {
  // container: {
  //   width: 400,
  //   margin: "0 auto",
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   padding: 20,
  // },
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
