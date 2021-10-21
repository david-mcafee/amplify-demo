import React, { useRef, useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import {
  Button,
  Divider,
  Container,
  Header,
  Icon,
  List,
  ListContent,
  ListHeader,
  ListItem,
} from "semantic-ui-react";
import Progress from "../Progress";
import { v4 as uuidv4 } from "uuid";
import { useStyles } from "./styles";

type File = {
  key?: string;
};

const initialState: number = 0;
const initialFileState: Array<File> = [];

// Track all events
Storage.configure({ track: true });

let cancelUpload = () => {};
let pauseUpload = () => {};
let resumeUpload = () => {};

const StorageDemo = () => {
  // let cancelUploadCallback = useRef(() => {});
  const [uploadProgress, setUploadProgress] = useState(initialState);
  const [files, setFiles] = useState(initialFileState);
  const [resumableUploadButtonDisabled, setResumableUploadButtonDisabled] =
    useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const { container } = useStyles();

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
      const upload = await Storage.put(`${file.name}-${fileUUID}`, file, {
        resumable: true,
        // track: true, // Can track a specific event
        metadata: { id: fileUUID }, // (map<String>) A map of metadata to store with the object in S3.
        progressCallback(progress: any) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploadProgress(calculatePercent(progress.loaded, progress.total));
        },
        errorCallback: (err: any) => {
          console.error("Unexpected error while uploading", err);
          setResumableUploadButtonDisabled(true);
        },
        completeCallback: (event: any) => {
          console.log(`Successfully uploaded ${event.key}`);
          setResumableUploadButtonDisabled(true);
          setUploadProgress(0);
        },
      });

      if (upload) {
        setResumableUploadButtonDisabled(false);
        cancelUpload = () => {
          console.log("cancel upload");
          Storage.cancel(upload);
        };
        pauseUpload = () => {
          console.log("pause upload");
          upload.pause();
        };
        resumeUpload = () => {
          console.log("resume upload");
          upload.resume();
        };
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function fetchFiles() {
    try {
      const result = await Storage.list("");
      console.log(result);
      setFiles(result);
    } catch (error) {
      console.log("error fetching files");
    }
  }

  async function copyFile(file: File) {
    try {
      // Copies 'existing/srcKey' to 'copied/destKey' within the 'public' access level
      const copied = await Storage.copy(
        { key: `${file.key}` },
        { key: `copied/${file.key}` }
      );
      console.log(copied);
    } catch (error) {
      console.log("error copying file", error);
    } finally {
      fetchFiles();
    }
  }

  const inputRef = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLInputElement>;

  return (
    <Container className={container}>
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
      <Divider />
      <Button disabled={resumableUploadButtonDisabled} onClick={pauseUpload}>
        Pause Upload
      </Button>
      <Divider />
      <Button disabled={resumableUploadButtonDisabled} onClick={resumeUpload}>
        Resume Upload
      </Button>
      <Divider />
      <Button disabled={resumableUploadButtonDisabled} onClick={cancelUpload}>
        Cancel Upload
      </Button>
      <Divider />
      <List>
        {files.map((file, index) => (
          <ListItem key={file.key ? file.key : index}>
            <ListContent floated="right">
              <Button onClick={() => copyFile(file)}>Copy</Button>
            </ListContent>
            <ListContent>
              <ListHeader>
                <p>{file.key}</p>
              </ListHeader>
            </ListContent>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default StorageDemo;
