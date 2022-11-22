import { DataStore } from "aws-amplify";

//@ts-ignore
function DataStoreOperations({ initSubs, deleteAll }) {
  return (
    <div>
      <p>DS</p>
      <div className="buttons">
        <button
          data-test="datastore-start"
          onClick={async () => {
            await DataStore.start();
            initSubs();
          }}
        >
          Start
        </button>
        <button onClick={async () => await DataStore.stop()}>Stop</button>
        <button
          data-test="datastore-clear"
          onClick={async () => await DataStore.clear()}
        >
          Clear
        </button>
        <button
          onClick={deleteAll}
          data-test="datastore-delete-all"
          style={{ backgroundColor: "red" }}
        >
          Delete All Records
        </button>
      </div>
    </div>
  );
}

export default DataStoreOperations;
