type ProgressExampleProps = {
  readonly uploadProgress: number;
};

const ProgressExample = ({ uploadProgress }: ProgressExampleProps) => (
  <progress id="file" value={uploadProgress} max="100" />
);

export default ProgressExample;
