module.exports = app => {
    const message = require("../controllers/message.controller");

    let router = require("express").Router();
    
    router.post('/files', message.getMessageFilesUrls)
    
    app.use('/file/message', router);
};