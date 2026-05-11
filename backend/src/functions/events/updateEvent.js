// src/functions/events/updateEvent.js
const { getDb } = require("../../libs/db");
const { getUserFromEvent } = require("../../middleware/auth");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[updateEvent] Invoked");

  try {
    const user = await getUserFromEvent(event);
    const db = getDb();
    const { id } = event.pathParameters;

    const dbUser = await db.user.findUnique({ where: { cognitoId: user.cognitoId } });
    const existing = await db.event.findUnique({ where: { id } });

    if (!existing) return error("Event not found", 404);
    if (existing.createdById !== dbUser.id) return error("Unauthorized", 403);

    const body = JSON.parse(event.body || "{}");
    const { title, description, date, location, capacity, imageUrl, documentUrl, status } = body;

    const updated = await db.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(capacity && { capacity }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(documentUrl !== undefined && { documentUrl }),
        ...(status && { status }),
      },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    console.log(`[updateEvent] Updated event: ${id}`);
    return success(updated);
  } catch (err) {
    console.error("[updateEvent] Error:", err);
    return error("Failed to update event", 500);
  }
};
