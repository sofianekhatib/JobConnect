const oracledb = require('oracledb')
async function connectDB() {
    const pool = await oracledb.createPool({
        user : proress.env.DB_USER,
        password : process.env.DB_PASSWORD,
        connectString : process.DB_CONNECT_STRING,
        poolMin : 1,
        poolMax : 5,
        poolIncrement : 1,
    })
    return pool;
}
module.exports = connectDB;