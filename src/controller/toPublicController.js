const fileService = require("../service/filePublicService");

module.exports = async (req, res) => {
  const { service_name, service_secret, file_name } = req.body;

  if (!service_name || !service_secret || !file_name) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const result = await fileService.markFileAsPublic({
      service_name,
      service_secret,
      file_name,
    });

    if (result.success) {
      return res.status(200).json({ message: "File marked as public." });
    } else {
      return res.status(result.status || 500).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error making file public:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
