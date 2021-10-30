module.exports = app => {
    const user_session = require("../controllers/user-session.controller");

    var router = require("express").Router();

    router.get('/:username/peerId', user_session.getPeerJsId)

    router.post('/:username/peerId', user_session.savePeerJsId)
    
    app.use('/chat/session', router);
};