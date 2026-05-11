// src/functions/events/deleteEvent.js
const { getDb } = require("../../libs/db");
const { getUserFromEvent } = require("../../middleware/auth");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[deleteEvent] Invoked");

  try {
    const user = await getUserFromEvent(event);
    const db = getDb();
    const { id } = event.pathParameters;

    const dbUser = await db.user.findUnique({ where: { cognitoId: user.cognitoId } });
    const existing = await db.event.findUnique({ where: { id } });

    if (!existing) return error("Event not found", 404);
    if (existing.createdById !== dbUser.id) return error("Unauthorized", 403);

    // Soft delete - mark as cancelled
    await db.event.update({ where: { id }, data: { status: "CANCELLED" } });

    console.log(`[deleteEvent] Deleted event: ${id}`);
    return success({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("[deleteEvent] Error:", err);
    return error("Failed to delete event", 500);
  }
};
