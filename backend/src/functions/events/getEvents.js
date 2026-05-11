// src/functions/events/getEvents.js
const { getDb } = require("../../libs/db");
const { paginated, error } = require("../../libs/response");

module.exports.handler = async (event) => {
  console.log("[getEvents] Invoked");

  try {
    const db = getDb();
    const { page = "1", limit = "12", search = "", status = "ACTIVE" } = event.queryStringParameters || {};

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { date: "asc" },
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { registrations: true } },
        },
      }),
      db.event.count({ where }),
    ]);

    return paginated(events, total, pageNum, limitNum);
  } catch (err) {
    console.error("[getEvents] Error:", err);
    return error("Failed to fetch events", 500);
  }
};
