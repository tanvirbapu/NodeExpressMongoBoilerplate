const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connect = require('./db_connect');
console.log('connect---',connect);
const config = require('./config/index');
const port=50111;

app.get('/', (req, res) => { res.send('app started') });

connect.then(() => {
    console.log(`Connected to MongoDB`);
}).catch((e) => {
    console.error(`Could not init db\n${e}`);
});

app.use(cors());
app.use(bodyParser.json());

require('./modules/user/router')(app);
require('./modules/admin/router')(app);

app.listen(port, () => console.log(`Listening on Port: ${port}`))