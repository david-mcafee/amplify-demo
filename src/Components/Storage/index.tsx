import React, { useRef, useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import Progress from "../Progress";
import { v4 as uuidv4 } from "uuid";
// import { useStyles } from "./styles";
import {
  Button,
  Card,
  Collection,
  Divider,
  Flex,
  Heading,
  // Icon,
} from "@aws-amplify/ui-react";

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

  // const { container } = useStyles();

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
    } finally {
      fetchFiles();
    }
  }

  async function uploadFile(e: any) {
    let fileUUID = uuidv4();
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
        completeCallback: (obj) => {
          console.log(`Successfully uploaded ${obj.key}`);
          setResumableUploadButtonDisabled(true);
          setUploadProgress(0);
          //@ts-ignore
          fileUUID = obj?.key;
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
    } finally {
      fetchFiles();
    }
  }

  async function fetchFiles() {
    try {
      const files = await Storage.list("");
      console.log(files);
      setFiles(files?.results);
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

  async function deleteFile(file: any) {
    try {
      await Storage.remove(file.key);
    } catch (error) {
      console.log("error deleting file", error);
    } finally {
      fetchFiles();
    }
  }

  async function downloadFile(file: any) {
    try {
      const signedUrl = await Storage.get(file.key);
      const a = document.createElement("a");
      a.href = signedUrl;
      a.download = file.key;
      a.click();
    } catch (error) {
      console.log("error downloading file", error);
    } finally {
      fetchFiles();
    }
  }

  return (
    <Card variation={"elevated"} width={"75vw"}>
      <Card variation={"outlined"}>
        <Flex direction={"column"}>
          <Heading as="h1">Lambda test</Heading>
          <Card variation={"outlined"}>
            <Button onClick={upload}>Upload text file</Button>
            <Button
              // content="Choose File"
              // labelPosition="left"
              // icon="file"
              onClick={() => inputRef.current.click()}
            />
            <input ref={inputRef} type="file" hidden onChange={uploadFile} />
          </Card>
        </Flex>
      </Card>
      <Divider />

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
      <Collection type="list" items={files}>
        {(file, index) => (
          <Card key={file.key ? file.key : index}>
            <Card>
              <Button onClick={() => deleteFile(file)}>
                {/* <Icon name="delete" color="red" /> */}
              </Button>
              <Button onClick={() => downloadFile(file)}>Download</Button>
              <Button onClick={() => copyFile(file)}>Copy</Button>
            </Card>
            <Card>
              <Heading>
                <p>{file.key}</p>
              </Heading>
            </Card>
          </Card>
        )}
      </Collection>
    </Card>
  );
};

export default StorageDemo;
