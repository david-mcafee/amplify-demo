import React, { useState } from "react";
import { API } from "aws-amplify";
import { Container, Header } from "semantic-ui-react";

const initialState = "test";

const Lambda = () => {
  const [response, setResponse] = useState(initialState);

  function getData() {
    const apiName = "MyApiName";
    const path = "/path";
    const myInit = {
      // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    };

    return API.get(apiName, path, myInit)
      .then((response) => {
        // Add your code here
        debugger;
        return response;
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  (async function callLambda() {
    const response = await getData();
    setResponse(response);
  })();

  return (
    <Container>
      <Header as="h1">Lambda test</Header>
      <p>{response}</p>
    </Container>
  );
};

export default Lambda;
