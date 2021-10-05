module.exports = app => {
    const user = require("../controllers/user.controller");

    var router = require("express").Router();
    
    const multer = require('multer')

    const upload = multer()

    router.post('/avatar', upload.single('avatar'), user.uploadUserAvatar)

    router.get('/:username/avatar', user.getUserAvatarUrl)
    
    router.delete('/:username/avatar', user.deleteUserAvatar)
    
    app.use('/file/users', router);
};