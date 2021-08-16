import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Container, Header } from "semantic-ui-react";

const initialState = "test";

const Lambda = () => {
  const [response, setResponse] = useState(initialState);

  function getData() {
    const apiName = "demorestapi";
    const path = "/items";
    const myInit = {
      // OPTIONAL
      headers: {}, // OPTIONAL
      // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    };

    return API.get(apiName, path, myInit)
      .then((response) => {
        // Add your code here
        return response;
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async function callLambda() {
    try {
      const response = await getData();
      setResponse(response);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    callLambda();
  });

  return (
    <Container>
      <Header as="h1">Lambda test</Header>
      <p>{response}</p>
    </Container>
  );
};

export default Lambda;
