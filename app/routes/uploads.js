let express = require('express');
let router = express.Router();
let formidable = require('formidable');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', (request, response, next) => {
    // let incomingForm = new formidable.IncomingForm({
    //     uploadDir: './uploads',
    //     keepExtensions: true
    // });

    // incomingForm.parse(request, (error, fields, files) => {
    //     response.json({files});
    // });

    response.json({
        "files": {
            "input-file": [
                {
                    "size": 2520315,
                    "filepath": "/home/romario/Documents/roma/dropbox-clone/app/uploads/58f1cbaa91527670775b57901.com",
                    "newFilename": "58f1cbaa91527670775b57901.com",
                    "mimetype": "image/jpeg",
                    "mtime": "2025-02-11T14:01:26.649Z",
                    "originalFilename": "wallpaperflare.com_wallpaper.jpg"
                }
            ]
        }
    });
});

module.exports = router;
