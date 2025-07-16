const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const fileSaveController = require("../controller/fileSaveController");
const { fileDeleteController } = require("../controller/fileDeleteController");
const toPublicController = require("../controller/toPublicController");
const toPravateController = require("../controller/toPrivateController");

router.post("/save-file", upload.single("file"), fileSaveController);
router.post("/delete-file", fileDeleteController);
router.post("/to-public", toPublicController);
router.post("/to-private", toPravateController);

module.exports = router;
