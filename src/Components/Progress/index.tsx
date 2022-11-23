type ProgressProps = {
	readonly uploadProgress: number;
};

const Progress = ({ uploadProgress }: ProgressProps) => (
	<progress id="file" value={uploadProgress} max="100" />
);

export default Progress;
