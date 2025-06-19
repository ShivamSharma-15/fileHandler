const express = require("express");
const app = express();
app.use(express.json());

const saveFile = require("./routes/saveFile.js");
app.use("/api/v1", saveFile);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
