// src/functions/auth/syncUser.js
const { getDb } = require("../../libs/db");

module.exports.handler = async (event) => {
  console.log("[syncUser] Cognito trigger event:", JSON.stringify(event));
  const db = getDb();

  try {
    const { sub, email, name } = event.request.userAttributes;

    await db.user.upsert({
      where: { cognitoId: sub },
      update: { email, name: name || email.split("@")[0] },
      create: { cognitoId: sub, email, name: name || email.split("@")[0] },
    });

    console.log(`[syncUser] User synced: ${email}`);
    return event; // Must return event for Cognito triggers
  } catch (err) {
    console.error("[syncUser] Error syncing user:", err);
    throw err;
  }
};
