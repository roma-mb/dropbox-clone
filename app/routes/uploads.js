let express = require("express");
let router = express.Router();
let formidable = require("formidable");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", (request, response, next) => {
  let incomingForm = new formidable.IncomingForm({
    uploadDir: "./uploads",
    keepExtensions: true,
  });

  incomingForm.parse(request, (error, fields, files) => {
    response.json({ files });
  });
});

module.exports = router;
