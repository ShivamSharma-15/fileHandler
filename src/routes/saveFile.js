const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const fileSaveController = require("../controller/fileSaveController");
const { fileDeleteController } = require("../controller/fileDeleteController");
const toPublicController = require("../controller/toPublicController");
const toPrivateController = require("../controller/toPrivateController");
const awsController = require("../controller/awsController");

router.post("/save-file", upload.single("file"), fileSaveController);
router.post("/delete-file", fileDeleteController);
router.post("/to-public", toPublicController);
router.post("/to-private", toPrivateController);
router.post("/to-aws", upload.single("file"), awsController);

module.exports = router;
