require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { SERVER_PORT } = process.env
const { CONNECTION_STRING } = process.env

const Sequelize = require('sequelize')
const app = express();

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

//middleware
app.use(cors());
app.use(express.json());


module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXIST SQUADRON;
            DROP TABLE IF EXIST WINNER;
            
                    CREATE TABLE SQUADRON (
                        SQUADRON_ID SERIAL PRIMARY KEY,
                        NAME VARCHAR,
                        SPEED INTEGER,
                        WINNER INTEGER
                    );
                    CREATE TABLE WINNER (
                        WINNER_ID SERIAL PRIMARY KEY,
                        NAME VARCHAR,
                        SPEED INTEGER,
                        SQUADRON_ID INT REFERENCES SQUADRON(SQUADRON_ID)
                    );

        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },
}


app.listen(SERVER_PORT, () => console.log("Server running on 4000"));
