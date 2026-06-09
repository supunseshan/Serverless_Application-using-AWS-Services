// src/functions/queue/monitorDLQ.js
// This Lambda can be triggered manually or on a schedule
// to inspect and report on failed messages in the Dead Letter Queue

const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: process.env.REGION || "us-east-1" });

module.exports.handler = async () => {
  console.log("[monitorDLQ] Checking Dead Letter Queue...");

  const DLQ_URL = process.env.SQS_DLQ_URL;
  if (!DLQ_URL) {
    console.warn("[monitorDLQ] SQS_DLQ_URL not set, skipping.");
    return { message: "DLQ URL not configured" };
  }

  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: DLQ_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
      AttributeNames: ["All"],
      MessageAttributeNames: ["All"],
    });

    const response = await sqsClient.send(command);
    const messages = response.Messages || [];

    console.log(`[monitorDLQ] Found ${messages.length} failed messages in DLQ`);

    for (const msg of messages) {
      console.error("[monitorDLQ] Failed message:", {
        messageId: msg.MessageId,
        body: msg.Body,
        approximateReceiveCount: msg.Attributes?.ApproximateReceiveCount,
        sentTimestamp: msg.Attributes?.SentTimestamp,
      });
    }

    return {
      dlqMessageCount: messages.length,
      messages: messages.map((m) => ({
        id: m.MessageId,
        body: JSON.parse(m.Body || "{}"),
        receiveCount: m.Attributes?.ApproximateReceiveCount,
      })),
    };
  } catch (err) {
    console.error("[monitorDLQ] Error:", err);
    throw err;
  }
};
