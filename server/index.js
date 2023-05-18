require('dotenv').config()
const { SERVER_PORT } = process.env
const { seed, getAllSquadrons } = require('./controllers.js')


const express = require("express");
const cors = require("cors");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

// DEV
app.post('/seed', seed)
app.get('/squadrons', getAllSquadrons)

app.listen(SERVER_PORT, () => console.log("Server running on 4000"));
