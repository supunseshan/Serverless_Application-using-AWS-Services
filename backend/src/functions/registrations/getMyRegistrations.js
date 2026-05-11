// src/functions/registrations/getMyRegistrations.js
const { getDb } = require("../../libs/db");
const { getUserFromEvent } = require("../../middleware/auth");
const { success, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[getMyRegistrations] Invoked");

  try {
    const user = await getUserFromEvent(event);
    const db = getDb();

    const dbUser = await db.user.findUnique({ where: { cognitoId: user.cognitoId } });
    if (!dbUser) return error("User not found", 404);

    const registrations = await db.registration.findMany({
      where: { userId: dbUser.id, status: "CONFIRMED" },
      include: {
        event: {
          include: { createdBy: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(registrations);
  } catch (err) {
    console.error("[getMyRegistrations] Error:", err);
    return error("Failed to fetch registrations", 500);
  }
};
