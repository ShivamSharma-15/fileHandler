const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const validateService = require("../service/serviceValidator");
const { saveMetadata, getServiceId } = require("../model/fileModel");

const permanentDir = path.join(__dirname, "..", "..", "uploads");

module.exports = async (req, res) => {
  const file = req.file;
  const { service_name, service_secret } = req.body;

  if (!file || !service_name || !service_secret) {
    return res
      .status(400)
      .json({ message: "Missing file or required fields." });
  }

  let finalPath;

  try {
    const serviceIdentifier = await validateService(
      service_name,
      service_secret
    );
    if (!serviceIdentifier) {
      await safeDelete(file.path);
      return res
        .status(401)
        .json({ message: "Unauthorized service credentials." });
    }

    const ext = path.extname(file.originalname);
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    const randomHex = crypto.randomBytes(3).toString("hex");
    const newFilename = `${serviceIdentifier}_${now}_${randomHex}${ext}`;
    finalPath = path.join(permanentDir, newFilename);

    await fs.mkdir(permanentDir, { recursive: true });

    await fs.rename(file.path, finalPath);

    const serviceId = await getServiceId(service_name);
    if (!serviceId) {
      await safeDelete(finalPath);
      return res.status(400).json({ message: "Service ID not found in DB." });
    }

    const metadata = {
      filename: newFilename,
      originalName: file.originalname,
      datetime: new Date(),
      size: file.size,
      mimeType: file.mimetype,
      serviceId,
    };

    const metadataSaved = await saveMetadata(metadata);
    if (!metadataSaved) {
      await safeDelete(finalPath);
      return res.status(500).json({ message: "Failed to save file metadata." });
    }

    return res.status(200).json({
      message: "File uploaded and processed successfully",
      filename: newFilename,
    });
  } catch (error) {
    console.error("File processing failed:", error);
    await safeDelete(finalPath || file?.path);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function safeDelete(filePath) {
  try {
    if (filePath) {
      await fs.unlink(filePath);
      console.log("Cleaned up file:", filePath);
    }
  } catch (err) {
    console.warn("Failed to delete file during cleanup:", err.message);
  }
}
