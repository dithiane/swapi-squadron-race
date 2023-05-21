require('dotenv').config()
const { SERVER_PORT } = process.env
const { seed, createSquadron, getAllSquadrons, getAllWinners, updateSquadron, updateWinner, deleteSquadron } = require('./controllers.js')


const express = require("express");
const cors = require("cors");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

// DEV
app.post('/seed', seed)
app.post('/squadrons', createSquadron)
app.get('/squadrons', getAllSquadrons)
app.get('/winners', getAllWinners)
app.put('/squadron/:id', updateSquadron)
app.put('/winner/:id', updateWinner)
app.delete('/squadron/:id', deleteSquadron)

app.listen(SERVER_PORT, () => console.log("Server running on 4000"));
