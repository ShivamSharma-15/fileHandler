const { deleteFileService } = require("../service/deleteFileService");

async function fileDeleteController(req, res) {
  const { service_name, service_secret, file_name } = req.body;
  if (!service_name || !service_secret || !file_name) {
    return res.status(400).json({
      message:
        "Missing required fields: service_name, service_secret, or file_name",
    });
  }
  try {
    const result = await deleteFileService({
      service_name,
      service_secret,
      file_name,
    });

    if (!result.success) {
      return res.status(result.status || 500).json({ message: result.message });
    }

    return res.status(200).json({
      message: "File deleted successfully",
      file: file_name,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = { fileDeleteController };
