const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const fileSaveController = require("../controller/fileSaveController");
const { fileDeleteController } = require("../controller/fileDeleteController");

router.post("/save-file", upload.single("file"), fileSaveController);
router.post("/delete-file", fileDeleteController);

module.exports = router;
