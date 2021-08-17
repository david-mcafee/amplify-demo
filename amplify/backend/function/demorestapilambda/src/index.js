exports.handler = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "https://www.davidmcafee.com",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
