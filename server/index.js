require('dotenv').config();

const 	express = require('express');
const 	cors = require('cors');
const 	bodyParser = require('body-parser');
const 	busboy = require('connect-busboy');
const 	mongoose = require('mongoose');
const   env = process.env;
const 	host = env.BASE_URL || 'http://127.0.0.1';
const   port = env.PORT || 8080;

const app = express();

const server = require('http').createServer(app);
const corsOptions = {
    //origin: "http://localhost:8081",
    origin: "*"
};
app.use(busboy());
app.use(bodyParser.json({limit: '10000000mb'}));
app.use(bodyParser.urlencoded({limit: '10000000mb', extended: true}));
app.use(cors());

const dbOptions = {
	socketTimeoutMS: 0,
	keepAlive: true
};
mongoose.connect(process.env.DB_CONNECT, dbOptions).then(
	() => {console.log('Database is connected') },
	err => { console.log('Can not connect to the database'+ err)}
);

const authenticateToken = require("./auth/authenticateToken");

app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/quiz-admin", authenticateToken, require("./routes/quiz-admin"));

server.listen(port, () => console.log(`listening on port ${port} + host ${host}`));

app.use(busboy());