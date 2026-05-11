// src/libs/s3.js
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: process.env.REGION || "us-east-1" });
const BUCKET = process.env.S3_BUCKET;
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

const generatePresignedUploadUrl = async (key, contentType, expiresIn = 300) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  const fileUrl = `${CLOUDFRONT_URL}/${key}`;
  return { uploadUrl, fileUrl };
};

const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3Client.send(command);
};

module.exports = { generatePresignedUploadUrl, deleteFile };
