module.exports = app => {
    const group = require("../controllers/group.controller");

    var router = require("express").Router();
    
    const multer = require('multer')

    const upload = multer()

    router.post('/avatar', upload.single('groupAvatar'), group.uploadGroupAvatar)
    router.get('/:groupId/avatar/', group.getGroupAvatar)

    app.use('/file/groups', router);
};