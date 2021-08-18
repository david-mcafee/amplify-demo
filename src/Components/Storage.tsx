import React from "react";
import { Storage } from "aws-amplify";
import { Button, Container, Header } from "semantic-ui-react";

const Lambda = () => {
  async function upload() {
    try {
      const response = await Storage.put("test.txt", "File content", {
        metadata: { key: "value" }, // (map<String>) A map of metadata to store with the object in S3.
        progressCallback(progress: any) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      console.log("response from storage-------------------");
      console.log(response);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadFile(e) {
    const file = e.target.files[0];
    try {
      const response = await Storage.put(file.name, file, {
        metadata: { key: "value" }, // (map<String>) A map of metadata to store with the object in S3.
        progressCallback(progress: any) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      console.log("response from storage-------------------");
      console.log(response);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <Container>
      <Header as="h1">Lambda test</Header>
      {/* <p>{response}</p> */}
      <Button onClick={upload}>Upload text file</Button>
      <input type="file" onChange={uploadFile} placeholder={"upload a file"} />
    </Container>
  );
};

export default Lambda;
