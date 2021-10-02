module.exports = app => {
    const group = require("../controllers/group.controller");

    var router = require("express").Router();
    
    const multer = require('multer')

    const upload = multer()

    router.post('/avatar', upload.single('avatar'), group.uploadGroupAvatar)

    app.use('/file/users', router);
};