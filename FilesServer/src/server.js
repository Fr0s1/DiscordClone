const express = require('express'); 
const app = express(); 
const http = require('http'); 
const server = http.createServer(app);
const cors = require('cors')
require('dotenv').config()

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json())
require('./routes/user.route')(app)
require('./routes/message.route')(app)

app.get('/file/healthcheck', (req, res) => { 
    res.send('File server is running'); 
});

const PORT = process.env.PORT || 8080
server.listen(PORT, () => { console.log(`listening on *:${PORT}`); });