module.exports = app => {
    const messages = require("../controllers/message.controller");

    var router = require("express").Router();

    var multer = require('multer')

    upload = multer()

    router.post('/', upload.any(), messages.saveMessage)
    
    app.use('/chat/message', router);
};