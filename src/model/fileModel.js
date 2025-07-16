const pool = require("../config/db");
async function getServiceByName(serviceName) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM services WHERE service_name = ?",
      [serviceName]
    );

    if (rows.length === 0) {
      console.warn(`failed`);
      return null;
    }
    return rows[0];
  } catch (err) {
    console.error("Database error in eventListModel:", err);
    throw err;
  }
}
async function getServiceId(serviceName) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM services WHERE service_name = ?",
      [serviceName]
    );

    if (rows.length === 0) {
      console.warn(`failed`);
      return null;
    }
    return rows[0].id;
  } catch (err) {
    console.error("Database error in getServiceId: ", err);
    throw err;
  }
}

async function saveMetadata(metadata) {
  try {
    const result = await pool.query(
      "INSERT INTO file_system (file_name, file_size, file_type, timeOfUpload, service_id) values (?, ?, ?, ? ,?)",
      [
        metadata.filename,
        metadata.size,
        metadata.mimeType,
        metadata.datetime,
        metadata.serviceId,
      ]
    );

    if (result.length === 0) {
      console.warn(`failed`);
      return null;
    }
    return result;
  } catch (err) {
    console.error("Database error in saveMetaData: ", err);
    throw err;
  }
}
async function getFileByName(file_name) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM file_system WHERE file_name = ?",
      [file_name]
    );

    if (rows.length === 0) {
      console.warn(`failed`);
      return null;
    }
    return rows[0];
  } catch (err) {
    console.error("Database error in eventListModel:", err);
    throw err;
  }
}
async function deleteFileMetadata(file_name) {
  try {
    const [rows] = await pool.query(
      "DELETE FROM file_system WHERE file_name = ?",
      [file_name]
    );

    if (rows.length === 0) {
      console.warn(`failed`);
      return null;
    }
    return true;
  } catch (err) {
    console.error("Database error in eventListModel:", err);
    throw err;
  }
}

async function setFilePublic(file_name, service_id) {
  try {
    const [result] = await pool.query(
      "UPDATE file_system SET is_public = 1 WHERE file_name = ? AND service_id = ?",
      [file_name, service_id]
    );

    return result.affectedRows > 0;
  } catch (err) {
    console.error("Database error in setFilePublic:", err);
    throw err;
  }
}
module.exports = {
  getServiceByName,
  getServiceId,
  saveMetadata,
  getFileByName,
  deleteFileMetadata,
  setFilePublic,
};
