require('dotenv').config();

const config = {
    dev: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'dental',
        host: process.env.DB_HOST || 'localhost',
        dbPort: process.env.DB_PORT || '5432',
        port: process.env.PORT || '5000',
        dialect: 'postgres',
        flaskHost: process.env.FLASK_HOST || 'http://localhost:5123',
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    },
}

module.exports = config;
