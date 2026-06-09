// src/functions/registrations/registerForEvent.js
const { getDb } = require("../../libs/db");
const { getUserFromEvent } = require("../../middleware/auth");
const { sendToQueue } = require("../../libs/sqs");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[registerForEvent] Invoked");

  try {
    const user = await getUserFromEvent(event);
    const db = getDb();
    const { id: eventId } = event.pathParameters;

    const dbUser = await db.user.findUnique({ where: { cognitoId: user.cognitoId } });
    if (!dbUser) return error("User not found", 404);

    const foundEvent = await db.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!foundEvent) return error("Event not found", 404);
    if (foundEvent.status !== "ACTIVE") return error("Event is not active", 400);

    // Check capacity
    if (foundEvent._count.registrations >= foundEvent.capacity) {
      return error("Event is at full capacity", 400);
    }

    // Check duplicate registration
    const existing = await db.registration.findUnique({
      where: { userId_eventId: { userId: dbUser.id, eventId } },
    });
    if (existing) {
      if (existing.status === "CONFIRMED") return error("Already registered for this event", 409);
      // Re-activate if previously cancelled
      const updated = await db.registration.update({
        where: { id: existing.id },
        data: { status: "CONFIRMED" },
        include: { event: true, user: true },
      });
      return success(updated, 200);
    }

    const registration = await db.registration.create({
      data: { userId: dbUser.id, eventId },
      include: { event: true, user: true },
    });

    // Send to SQS for async email processing
    await sendToQueue({
      type: "REGISTRATION_CONFIRMATION",
      registrationId: registration.id,
      userEmail: dbUser.email,
      userName: dbUser.name,
      eventTitle: foundEvent.title,
      eventDate: foundEvent.date,
      eventLocation: foundEvent.location,
    });

    console.log(`[registerForEvent] Registration created: ${registration.id}`);
    return success(registration, 201);
  } catch (err) {
    console.error("[registerForEvent] Error:", err);
    return error("Failed to register for event", 500);
  }
};
