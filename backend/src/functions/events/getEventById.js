// src/functions/events/getEventById.js
const { getDb } = require("../../libs/db");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[getEventById] Invoked");

  try {
    const db = getDb();
    const { id } = event.pathParameters;

    const foundEvent = await db.event.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!foundEvent) return error("Event not found", 404);

    return success(foundEvent);
  } catch (err) {
    console.error("[getEventById] Error:", err);
    return error("Failed to fetch event", 500);
  }
};
