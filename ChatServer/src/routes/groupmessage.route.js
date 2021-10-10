module.exports = app => {
    const groupMessage = require("../controllers/groupmessage.controller");

    var router = require("express").Router();

    var multer = require('multer')

    upload = multer()

    router.post('/', upload.any(), groupMessage.saveMessage)
    
    app.use('/chat/groupmessage', router);
};