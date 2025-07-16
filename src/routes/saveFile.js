const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const fileSaveController = require("../controller/fileSaveController");
const { fileDeleteController } = require("../controller/fileDeleteController");
const toPublicController = require("../controller/toPublicController");

router.post("/save-file", upload.single("file"), fileSaveController);
router.post("/delete-file", fileDeleteController);
router.post("/to-public", upload.single("file"), toPublicController);

module.exports = router;
