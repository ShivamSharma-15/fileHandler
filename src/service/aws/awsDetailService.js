const path = require("path");
const fs = require("fs");

const generateS3DetailsService = async ({ file, service_name, service_secret }) => {
  // Placeholder check for service credentials
  if (service_secret !== process.env.SERVICE_SECRET) {
    throw new Error("Invalid service credentials");
  }

  const bucketName = process.env.S3_BUCKET_NAME;
  const timestamp = Date.now();
  const fileExtension = path.extname(file.originalname);
  const s3Key = `vivo/${service_name}/${timestamp}_${file.originalname}`;
  const localFilePath = file.path;

  // Optional: Verify that file exists before proceeding
  if (!fs.existsSync(localFilePath)) {
    throw new Error("File not found on local disk");
  }

  return {
    bucketName,
    s3Key,
    localFilePath,
  };
};

module.exports = generateS3DetailsService;
