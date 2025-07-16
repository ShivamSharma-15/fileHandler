const { getServiceByName, setFilePublic, setFilePrivate } = require("../model/fileModel");

async function markFileAsPublic({ service_name, service_secret, file_name }) {
  const service = await getServiceByName(service_name);

  if (!service || service.service_secret !== service_secret) {
    return { success: false, message: "Unauthorized service credentials.", status: 401 };
  }

  const updated = await setFilePublic(file_name, service.id);
  if (!updated) {
    return { success: false, message: "File not found or not updated.", status: 404 };
  }

  return { success: true };
}

async function markFileAsPrivate({ service_name, service_secret, file_name }) {
  const service = await getServiceByName(service_name);

  if (!service || service.service_secret !== service_secret) {
    return { success: false, message: "Unauthorized service credentials.", status: 401 };
  }

  const updated = await setFilePrivate(file_name, service.id);
  if (!updated) {
    return { success: false, message: "File not found or not updated.", status: 404 };
  }

  return { success: true };
}
module.exports = { markFileAsPublic, markFileAsPrivate };