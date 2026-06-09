// src/libs/sqs.js
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: process.env.REGION || "us-east-1" });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

const sendToQueue = async (messageBody) => {
  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(messageBody),
  });
  return sqsClient.send(command);
};

module.exports = { sendToQueue };
