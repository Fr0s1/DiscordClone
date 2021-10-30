const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

require('dotenv').config({ path: path.join(process.cwd(), 'env/.env') })

let corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));
app.use(bodyParser.json())

require('./routes/message.route')(app)
require('./routes/groupmessage.route')(app)
require('./routes/user-session.route')(app)

let userSessionController = require('./controllers/user-session.controller')

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    allowEIO3: true,
});

const nsp = io.of('/chat')
nsp.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected`)

    // Save socket id which connect to server
    socket.on('currentUser', data => {
        userSessionController.saveSocketID(data)
    })

    socket.on("chatMessage", async (msg) => {
        let receiverSocketId = await userSessionController.getSocketId(msg.receiver.username)

        if (receiverSocketId) {
            nsp.to(receiverSocketId).emit("chatMessage", msg)
        }
    });
});

app.get('/chat/healthz', (req, res) => {
    res.send(`🚀 Server ready at ${hostname}/chat`);
});

const PORT = process.env.PORT || 3000
const os = require("os");
const hostname = os.hostname()
server.listen(PORT, () => { console.log(`🚀 Server ready at ${hostname}:${PORT}/chat`) })
