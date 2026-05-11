// src/functions/scheduler/sendEventReminders.js
const { getDb } = require("../../libs/db");
const { sendEventReminder } = require("../../libs/ses");

module.exports.handler = async () => {
  console.log("[sendEventReminders] Scheduler triggered at:", new Date().toISOString());

  const db = getDb();

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Find all events happening tomorrow
    const upcomingEvents = await db.event.findMany({
      where: {
        date: { gte: startOfTomorrow, lte: endOfTomorrow },
        status: "ACTIVE",
      },
      include: {
        registrations: {
          where: { status: "CONFIRMED" },
          include: { user: true },
        },
      },
    });

    console.log(`[sendEventReminders] Found ${upcomingEvents.length} events tomorrow`);

    let emailsSent = 0;
    const emailPromises = [];

    for (const event of upcomingEvents) {
      for (const registration of event.registrations) {
        emailPromises.push(
          sendEventReminder({
            userEmail: registration.user.email,
            userName: registration.user.name,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
          }).then(() => {
            emailsSent++;
            console.log(`[sendEventReminders] Reminder sent to: ${registration.user.email}`);
          })
        );
      }
    }

    await Promise.allSettled(emailPromises);
    console.log(`[sendEventReminders] Total reminders sent: ${emailsSent}`);

    return { emailsSent, eventsProcessed: upcomingEvents.length };
  } catch (err) {
    console.error("[sendEventReminders] Error:", err);
    throw err;
  }
};
