import React, { useRef, useState } from "react";
import { Storage } from "aws-amplify";
import { Button, Divider, Container, Header } from "semantic-ui-react";
import Progress from "../Progress";
import { v4 as uuidv4 } from "uuid";

const initialState: number = 0;

// Track all events
Storage.configure({ track: true });

const StorageDemo = () => {
  const [uploadProgress, setUploadProgress] = useState(initialState);

  const calculatePercent = (loaded: number, total: number) =>
    Math.floor((loaded / total) * 100);

  async function upload() {
    const fileUUID = uuidv4();

    try {
      const response = await Storage.put(
        `test-${fileUUID}.txt`,
        "File content",
        {
          // track: true, // Can track a specific event
          metadata: { id: fileUUID }, // (map<String>) A map of metadata to store with the object in S3.
        }
      );
      console.log(response);
    } catch (error) {
      console.log("Error uploading text file: ", error);
    }
  }

  async function uploadFile(e: any) {
    const fileUUID = uuidv4();
    const file = e.target.files[0];
    try {
      const response = await Storage.put(`${file.name}-${fileUUID}`, file, {
        // track: true, // Can track a specific event
        metadata: { id: fileUUID }, // (map<String>) A map of metadata to store with the object in S3.
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

  const inputRef = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLInputElement>;

  return (
    <Container style={styles.container}>
      <Header as="h1">Lambda test</Header>
      <Button onClick={upload}>Upload text file</Button>
      <Divider />
      <Button
        content="Choose File"
        labelPosition="left"
        icon="file"
        onClick={() => inputRef.current.click()}
      />
      <input ref={inputRef} type="file" hidden onChange={uploadFile} />
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
