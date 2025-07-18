const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const REGION = "ap-south-1";
const VERBOSE = "true";

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const log = (...args) => {
  if (VERBOSE) {
    console.log("[S3 UPLOAD LOG]", ...args);
  }
};

const uploadFileToS3 = async (bucketName, localFilePath, s3Key) => {
  try {
    log("Preparing to upload to S3");
    log("Local File Path:", localFilePath);

    const fileContent = fs.readFileSync(localFilePath);
    const contentType =
      mime.lookup(localFilePath) || "application/octet-stream";

    log("Detected MIME type:", contentType);
    log("Target Bucket:", bucketName);
    log("S3 Key (Object path):", s3Key);
    log("File Size (bytes):", fileContent.length);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      ACL: "public-read",
    });

    log("Constructed PutObjectCommand:", {
      Bucket: command.input.Bucket,
      Key: command.input.Key,
      ContentType: command.input.ContentType,
      ACL: "public-read",
    });

    const response = await s3.send(command);

    log("AWS SDK Raw Response:", response);

    const publicUrl = `https://${bucketName}.s3.${REGION}.amazonaws.com/${s3Key}`;
    log("File successfully uploaded. Public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error.name || "UnknownError");
    console.error("Full Error Object:", error);
    throw new Error("Failed to upload file to S3");
  }
};

module.exports = { uploadFileToS3 };
