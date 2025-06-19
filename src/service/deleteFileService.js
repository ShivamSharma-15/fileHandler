const path = require("path");
const fs = require("fs/promises");
const validateService = require("./serviceValidator");
const {
  getFileByName,
  deleteFileMetadata,
  getServiceId,
} = require("../model/fileModel");

const uploadDir = path.join(__dirname, "..", "..", "uploads");

async function deleteFileService({ service_name, service_secret, file_name }) {
  try {
    // 1. Authenticate service
    const serviceIdentifier = await validateService(
      service_name,
      service_secret
    );
    if (!serviceIdentifier) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized service credentials.",
      };
    }

    const fileRecord = await getFileByName(file_name);
    if (!fileRecord) {
      return {
        success: false,
        status: 404,
        message: "File not found in metadata.",
      };
    }

    const serviceId = await getServiceId(service_name);
    if (fileRecord.service_id !== serviceId) {
      return {
        success: false,
        status: 403,
        message: "You do not have permission to delete this file.",
      };
    }

    // 4. Delete file from disk
    const filePath = path.join(uploadDir, file_name);
    await fs.unlink(filePath).catch((err) => {
      if (err.code === "ENOENT") {
        console.warn("File already deleted from disk:", file_name);
      } else {
        throw err;
      }
    });

    // 5. Remove metadata
    const dbDeleteSuccess = await deleteFileMetadata(file_name);
    if (!dbDeleteSuccess) {
      return {
        success: false,
        status: 500,
        message: "Failed to delete file metadata from DB.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteFileService error:", error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}

module.exports = { deleteFileService };
