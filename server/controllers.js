require('dotenv').config()
const { CONNECTION_STRING } = process.env

const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
                       DROP TABLE IF EXISTS WINNER;
            DROP TABLE IF EXISTS SQUADRON;
                    CREATE TABLE SQUADRON (
                        squadron_id SERIAL PRIMARY KEY,
                        name VARCHAR,
                        speed INTEGER
                    );
                    CREATE TABLE WINNER (
                        winner_id SERIAL PRIMARY KEY,
                        name VARCHAR,
                        speed INTEGER,
                        squadron_id INT REFERENCES SQUADRON(squadron_id)
                    );

                    INSERT INTO SQUADRON (
                        name,
                        speed
                    )
                    VALUES
                    ('CR90 corvette', 950),
                    ('Star Destroyer', 975),
                    ('Sentinel-class landing craft', 1000),
                    ('Death Star', 925),
                    ('Millennium Falcon', 1050),
                    ('Y-wing', 1000),
                    ('X-wing', 1050),
                    ('TIE Advanced x1', 1200);

        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },

    getAllSquadrons: (req, res) => {
        sequelize.query(`
        SELECT *
        FROM squadron
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => {
                console.log(`There was an error in getSquadrons`, err)
                res.status(500).send(err)
            })
    },
}

