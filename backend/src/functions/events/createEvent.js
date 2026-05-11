// src/functions/events/createEvent.js
const { getDb } = require("../../libs/db");
const { getUserFromEvent } = require("../../middleware/auth");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[createEvent] Invoked");

  try {
    const user = await getUserFromEvent(event);
    const db = getDb();

    const dbUser = await db.user.findUnique({ where: { cognitoId: user.cognitoId } });
    if (!dbUser) return error("User not found", 404);

    const body = JSON.parse(event.body || "{}");
    const { title, description, date, location, capacity, imageUrl, documentUrl } = body;

    if (!title || !description || !date || !location) {
      return error("Missing required fields: title, description, date, location", 400);
    }

    const newEvent = await db.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: capacity || 100,
        imageUrl: imageUrl || null,
        documentUrl: documentUrl || null,
        createdById: dbUser.id,
      },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
    });

    console.log(`[createEvent] Created event: ${newEvent.id}`);
    return success(newEvent, 201);
  } catch (err) {
    console.error("[createEvent] Error:", err);
    return error("Failed to create event", 500);
  }
};
