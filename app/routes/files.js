let express = require("express");
let router = express.Router();
let formidable = require("formidable");

const fs = require("fs");

router.post("/uploads", (request, response, next) => {
  let incomingForm = new formidable.IncomingForm({
    uploadDir: "./uploads",
    keepExtensions: true,
  });

  incomingForm.parse(request, (error, fields, files) => {
    response.json({ files });
  });
});

router.delete("/delete", (request, response, next) => {
  const payload = request.body;
  const filePath = payload?.filepath ?? "";

  if (!fs.existsSync(filePath)) {
    response.status(400).json({ message: "File path not found." });
  }

  fs.unlink(filePath, (error) => {
    if (error) {
      return response.status(400).json({ error });
    }

    response.json({ message: "File removed." });
  });
});

module.exports = router;
