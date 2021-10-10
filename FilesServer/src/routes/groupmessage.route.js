module.exports = app => {
    const message = require("../controllers/groupmessage.controller");

    let router = require("express").Router();

    router.post('/files', message.getMessageFilesUrls)

    app.use('/file/groupmessage', router);
};