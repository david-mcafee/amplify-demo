import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Card, Heading } from "@aws-amplify/ui-react";

const initialState = "Loading...";

const Lambda = () => {
  const [response, setResponse] = useState(initialState);

  function getData() {
    const apiName = "demorestapi";
    const path = "/items";
    const myInit = {
      // OPTIONAL
      headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    };

    return API.get(apiName, path, myInit)
      .then((response) => {
        // Add your code here
        return response;
      })
      .catch((error) => {
        setResponse("Error calling Lambda...");
        console.log(error.response);
      });
  }

  async function callLambda() {
    try {
      const response = await getData();
      console.log(response);
      setResponse(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    callLambda();
  });

  return (
    <Card>
      <Heading as="h1">Lambda test</Heading>
      <p>{response}</p>
    </Card>
  );
};

export default Lambda;
