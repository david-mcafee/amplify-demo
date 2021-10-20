// exports.handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     //  Uncomment below to enable CORS requests
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "*", // TODO
//     },
//     body: JSON.stringify("Hello from Lambda!"),
//   };
//   return response;
// };

// https://blog.focusotter.com/send-an-sms-to-customers-using-react-and-aws-amplify
/* Amplify Params - DO NOT EDIT
    API_DELIVERYAPI_APIID
    API_DELIVERYAPI_APINAME
    ENV
    REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const SNSClient = new AWS.SNS();

exports.handler = async (event) => {
  // 1. get orderID from the event
  // const orderID = JSON.parse(event.body).orderID;

  // 🪄 used orderID to look up orderDetails in database 🪄

  const order = {
    orderID: "123-abc",
    address: "987 fakeaddress ln",
    phoneNumber: "+12813308004", //replace with your phone #
  };

  let response;

  try {
    // 2.  🎉 send order update to customer
    const resp = await SNSClient.publish({
      Message: "Your order is out for delivery",
      TargetArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: {
        sms: {
          DataType: "String.Array",
          StringValue: JSON.stringify([order.phoneNumber]),
        },
      },
    }).promise();
    console.log(resp);
    // 3. send response back to the frontend
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        address: "SNS PUBLISHED",
      }),
    };
  } catch (e) {
    console.log(e);
    // todo: update response for when things go bad 😢
  }
  return response;
};
