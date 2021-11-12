const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), 'env/.env') })

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json())

require('./routes/user.route')(app)
require('./routes/message.route')(app)
require('./routes/group.route')(app)
require('./routes/groupmessage.route')(app)

app.get('/file/healthcheck', (req, res) => {
    res.send('File server is running');
});

app.get('/file/healthz', (req, res) => {
    res.send(`🚀 Server ready at ${hostname}/file`);
});

const PORT = process.env.PORT || 8000
const os = require("os")
const hostname = os.hostname()
server.listen(PORT, () => { console.log(`🚀 Server ready at ${hostname}:${PORT}/file`) })