module.exports = app => {
    const user = require("../controllers/user.controller");

    var router = require("express").Router();
    
    const multer = require('multer')

    const upload = multer()

    router.post('/avatar', upload.single('avatar'), user.uploadUserAvatar)

    router.get('/avatar/:username', user.getUserAvatarUrl)
    
    app.use('/file/users', router);
};