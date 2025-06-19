const { getServiceByName } = require("../model/fileModel");
module.exports = async function validateService(serviceName, serviceSecret) {
  const service = await getServiceByName(serviceName);
  if (service && service.service_secret == serviceSecret) {
    return service.service_identifier;
  }
  return null;
};
