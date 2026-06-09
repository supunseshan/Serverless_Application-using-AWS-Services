// src/functions/notifications/processEmailQueue.js
const { sendRegistrationConfirmation } = require("../../libs/ses");

module.exports.handler = async (event) => {
  console.log("[processEmailQueue] Processing", event.Records.length, "messages");

  const results = await Promise.allSettled(
    event.Records.map(async (record) => {
      const message = JSON.parse(record.body);
      console.log("[processEmailQueue] Processing message:", message.type);

      if (message.type === "REGISTRATION_CONFIRMATION") {
        await sendRegistrationConfirmation({
          userEmail: message.userEmail,
          userName: message.userName,
          eventTitle: message.eventTitle,
          eventDate: message.eventDate,
          eventLocation: message.eventLocation,
        });
        console.log(`[processEmailQueue] Confirmation email sent to: ${message.userEmail}`);
      }
    })
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error("[processEmailQueue] Failed messages:", failed);
    // Re-throw to send to DLQ
    throw new Error(`${failed.length} messages failed processing`);
  }

  return { statusCode: 200, body: "Processed" };
};
