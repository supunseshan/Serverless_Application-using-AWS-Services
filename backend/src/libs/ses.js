// src/libs/ses.js
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: process.env.REGION || "us-east-1" });
const FROM_EMAIL = process.env.SES_FROM_EMAIL;

const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
  const command = new SendEmailCommand({
    Source: `CloudWave Events <${FROM_EMAIL}>`,
    Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: htmlBody, Charset: "UTF-8" },
        Text: { Data: textBody || subject, Charset: "UTF-8" },
      },
    },
  });
  return sesClient.send(command);
};

const sendRegistrationConfirmation = async ({ userEmail, userName, eventTitle, eventDate, eventLocation }) => {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Segoe UI', sans-serif; background: #0a0a0f; color: #e0e0e0; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(99,102,241,0.3);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; padding: 12px 24px;">
              <span style="color: white; font-size: 20px; font-weight: 700; letter-spacing: 2px;">CLOUDWAVE</span>
            </div>
          </div>
          <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px; text-align: center;">You're Registered! 🎉</h1>
          <p style="color: #a0a0b0; text-align: center; margin: 0 0 32px;">Here are your event details</p>
          <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; border: 1px solid rgba(99,102,241,0.2);">
            <h2 style="color: #6366f1; margin: 0 0 16px; font-size: 22px;">${eventTitle}</h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="color: #6366f1; font-size: 18px;">📅</span>
                <span style="color: #e0e0e0;">${formattedDate}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="color: #6366f1; font-size: 18px;">📍</span>
                <span style="color: #e0e0e0;">${eventLocation}</span>
              </div>
            </div>
          </div>
          <p style="color: #a0a0b0; text-align: center; margin: 32px 0 0; font-size: 14px;">
            Hi ${userName}, we look forward to seeing you there!<br>
            <span style="color: #6366f1;">CloudWave Events Team</span>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `✅ Registration Confirmed: ${eventTitle}`,
    htmlBody,
    textBody: `You are registered for ${eventTitle} on ${formattedDate} at ${eventLocation}.`,
  });
};

const sendEventReminder = async ({ userEmail, userName, eventTitle, eventDate, eventLocation }) => {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', sans-serif; background: #0a0a0f; color: #e0e0e0; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 40px; border: 1px solid rgba(99,102,241,0.3);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; padding: 12px 24px;">
              <span style="color: white; font-size: 20px; font-weight: 700; letter-spacing: 2px;">CLOUDWAVE</span>
            </div>
          </div>
          <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px; text-align: center;">⏰ Event Reminder</h1>
          <p style="color: #a0a0b0; text-align: center; margin: 0 0 32px;">Your event is coming up tomorrow!</p>
          <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; border: 1px solid rgba(99,102,241,0.2);">
            <h2 style="color: #6366f1; margin: 0 0 16px;">${eventTitle}</h2>
            <p style="color: #e0e0e0; margin: 0;">📅 ${formattedDate}</p>
            <p style="color: #e0e0e0; margin: 8px 0 0;">📍 ${eventLocation}</p>
          </div>
          <p style="color: #a0a0b0; text-align: center; margin: 24px 0 0; font-size: 14px;">
            Hi ${userName}, don't forget — we'll see you there!<br>
            <span style="color: #6366f1;">CloudWave Events Team</span>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `⏰ Reminder: ${eventTitle} is Tomorrow!`,
    htmlBody,
    textBody: `Reminder: ${eventTitle} is tomorrow at ${formattedDate}, ${eventLocation}.`,
  });
};

module.exports = { sendEmail, sendRegistrationConfirmation, sendEventReminder };
