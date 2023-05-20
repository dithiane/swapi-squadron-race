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
                        speed INTEGER,
                        acceleration NUMERIC
                    );
                    CREATE TABLE WINNER (
                        winner_id SERIAL PRIMARY KEY,
                        name VARCHAR,
                        speed INTEGER,
                        squadron_id INT REFERENCES SQUADRON(squadron_id)
                    );

                    INSERT INTO SQUADRON (
                        name,
                        speed,
                        acceleration
                    )
                    VALUES
                    ('CR90', 750, 3.6),
                    ('StarDestroyer', 675, 5.4),
                    ('SentinelCraft', 1000, 2.3),
                    ('DeathStar', 525, 4.5),
                    ('MillenniumFalcon', 1150, 3.2),
                    ('Ywing', 1200, 1.4),
                    ('Xwing', 1050, 3.2),
                    ('TIEAdvancedX1', 1200, 1.1);

        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },

    getAllSquadrons: (req, res) => {
        sequelize.query(`
        SELECT *
        FROM squadron
        ORDER BY name
        `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => {
                console.log(`There was an error in getSquadrons`, err)
                res.status(500).send(err)
            })
    },
    deleteSquadron: (req, res) => {
        const { id } = req.params
        sequelize.query(`
            DELETE FROM squadron
            WHERE squadron_id = ${id};
            SELECT *
            FROM squadron
            ORDER BY name
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                console.log(dbRes[0])
            })
            .catch(err => {
                console.log(`There was an error in deleteSquadron`, err)
                res.status(500).send(err)
            })
    },
    updateSquadron: (req, res) => {
        const { id } = req.params
        const { speed } = req.body
        sequelize.query(`
            UPDATE squadron
            SET speed = ${speed}
            WHERE squadron_id = ${id};
            SELECT *
            FROM squadron
            ORDER BY name
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                console.log(dbRes[0])
            })
            .catch(err => {
                console.log(`There was an error in deleteSquadron`, err)
                res.status(500).send(err)
            })
    },
    createSquadron: (req, res) => {
        const { speed, name, acceleration } = req.body
        sequelize.query(`
            INSERT INTO squadron (name, speed, acceleration)
            VALUES(${speed}, '${name}', ${acceleration});
            SELECT *
            FROM squadron
            ORDER BY name
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                console.log(dbRes[0])
            })
            .catch(err => {
                console.log(`There was an error in deleteSquadron`, err)
                res.status(500).send(err)
            })
    },
}

