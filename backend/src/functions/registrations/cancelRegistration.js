// src/functions/registrations/cancelRegistration.js
const { getDb } = require("../../libs/db");
const { getUserFromEvent } = require("../../middleware/auth");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[cancelRegistration] Invoked");

  try {
    const user = await getUserFromEvent(event);
    const db = getDb();
    const { id } = event.pathParameters;

    const dbUser = await db.user.findUnique({ where: { cognitoId: user.cognitoId } });
    const registration = await db.registration.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!registration) return error("Registration not found", 404);
    if (registration.userId !== dbUser.id) return error("Unauthorized", 403);
    if (registration.status === "CANCELLED") return error("Registration already cancelled", 400);

    const updated = await db.registration.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    console.log(`[cancelRegistration] Cancelled: ${id}`);
    return success(updated);
  } catch (err) {
    console.error("[cancelRegistration] Error:", err);
    return error("Failed to cancel registration", 500);
  }
};
