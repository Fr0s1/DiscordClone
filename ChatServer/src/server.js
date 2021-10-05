const express = require('express'); 
const app = express(); 
const http = require('http'); 
const server = http.createServer(app);
const cors = require('cors')

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));

require('./routes/message.route')(app)

const io = require("socket.io")(server, {  
    cors: {    
        origin: "*",    
        methods: ["GET", "POST"]  
}});

io.on("connection", (socket) => {
    console.log('Connected')
})

app.get('/chat/healthz', (req, res) => { 
    res.send(`🚀 Server ready at ${hostname}/chat`); 
});

const PORT = process.env.PORT || 3000
const os = require("os")
const hostname = os.hostname()
server.listen(PORT, () => { console.log(`🚀 Server ready at ${hostname}/chat`) })
