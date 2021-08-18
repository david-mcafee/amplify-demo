import React, { useState } from "react";
import { Storage } from "aws-amplify";
import { Button, Divider, Container, Header } from "semantic-ui-react";
import Progress from "./Progress";

const initialState: number = 0;

const StorageDemo = () => {
  const [uploadProgress, setUploadProgress] = useState(initialState);

  const calculatePercent = (loaded: number, total: number) =>
    Math.floor((loaded / total) * 100);

  async function upload() {
    try {
      const response = await Storage.put("test.txt", "File content", {
        metadata: { key: "value" }, // (map<String>) A map of metadata to store with the object in S3.
      });
      console.log(response);
    } catch (error) {
      console.log("Error uploading text file: ", error);
    }
  }

  async function uploadFile(e: any) {
    const file = e.target.files[0];
    try {
      const response = await Storage.put(file.name, file, {
        metadata: { key: "value" }, // (map<String>) A map of metadata to store with the object in S3.
        progressCallback(progress: any) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploadProgress(calculatePercent(progress.loaded, progress.total));
        },
      });

      if (response) setUploadProgress(0);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <Container style={styles.container}>
      <Header as="h1">Lambda test</Header>
      <Button onClick={upload}>Upload text file</Button>
      <Divider />
      <input type="file" onChange={uploadFile} placeholder={"upload a file"} />
      <Divider />
      <Progress uploadProgress={uploadProgress} />
    </Container>
  );
};

export default StorageDemo;

type Styles = {
  container: React.CSSProperties;
};

const styles: Styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "10vh",
  },
};
