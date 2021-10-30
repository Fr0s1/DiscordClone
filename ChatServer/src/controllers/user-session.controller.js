// This file is used to save sessionID of socket.io socket or PeerJs socket

const redisClient = require('../redis/redisClient')

async function saveSocketID(data) {
    let user_session = `chat:user:${data.user}`

    let result = redisClient.hsetAsync(user_session, "socketId", data.id)
}

async function getSocketId(username) {
    let user_session = `chat:user:${username}`

    try {
        let result = await redisClient.hgetAsync(user_session, "socketId")

        return result
    } catch (e) {
        return {
            error: `Can't get socket Id of user ${username}`
        }
    }
}


async function savePeerJsId(req, res) {
    let username = req.params.username

    let user_session = `chat:user:${username}`

    let peerId = req.body.peerId

    try {
        let result = redisClient.hsetAsync(user_session, "peerId", peerId)

        res.send({
            message: `Saved peerId of user ${username}`
        })
    } catch (e) {
        res.send({
            error: `Save peerId of user ${username} failed`
        })
    }
}

async function getPeerJsId(req, res) {
    let username = req.params.username

    let user_session = `chat:user:${username}`

    try {
        let result = await redisClient.hgetAsync(user_session, "peerId")

        res.send(result)
    } catch (e) {
        res.send({
            error: `Can't get PeerJS Id of user ${username}`
        })
    }
}

module.exports = {
    saveSocketID,
    getSocketId,
    savePeerJsId,
    getPeerJsId
}
