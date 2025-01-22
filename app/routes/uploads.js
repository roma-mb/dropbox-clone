let express = require('express');
let router = express.Router();
let formidable = require('formidable');


router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', (request, response, next) => {
    console.log('response');

    // formidable.IncomingForm({
    //     uploadDir: './uploads',
    //     keepExtensions: true
    // });

    response.json({success: true});
});

module.exports = router;
