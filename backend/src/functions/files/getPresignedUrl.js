// src/functions/files/getPresignedUrl.js
const { getUserFromEvent } = require("../../middleware/auth");
const { generatePresignedUploadUrl } = require("../../libs/s3");
const { success, error } = require("../../libs/response");
const { v4: uuidv4 } = require("uuid");

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

module.exports.handler = async (event) => {
  console.log("[getPresignedUrl] Invoked");

  try {
    await getUserFromEvent(event);
    const body = JSON.parse(event.body || "{}");
    const { contentType, folder = "general" } = body;

    if (!contentType || !ALLOWED_TYPES[contentType]) {
      return error(`Unsupported file type. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`, 400);
    }

    const ext = ALLOWED_TYPES[contentType];
    const key = `${folder}/${uuidv4()}.${ext}`;

    const { uploadUrl, fileUrl } = await generatePresignedUploadUrl(key, contentType);

    console.log(`[getPresignedUrl] Generated for key: ${key}`);
    return success({ uploadUrl, fileUrl, key });
  } catch (err) {
    console.error("[getPresignedUrl] Error:", err);
    return error("Failed to generate presigned URL", 500);
  }
};
