const { generateS3DetailsService } = require("../services/aws/generateS3DetailsService");
const { uploadFileToS3 } = require("../services/aws/uploadFiles");

const fileUploadController = async (req, res, next) => {
  try {
    const { file } = req; 
    const { service_name, service_secret } = req.body;

    if (!file || !service_name || !service_secret) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 1: Generate S3 bucket/key details
    const { bucketName, s3Key, localFilePath } = await generateS3DetailsService({
      file,
      service_name,
      service_secret,
    });

    // Step 2: Upload to S3
    const fileUrl = await uploadFileToS3(bucketName, localFilePath, s3Key);

    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    next(err);
  }
};

module.exports = fileUploadController;
