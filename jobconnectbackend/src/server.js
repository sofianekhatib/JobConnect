const express = require('express')
const connectDB = require('./config/db')
const app = express();
app.use(express.json());
require('dotnev').config();
async function startServer() {
    try {
        const pool = connectDB();
        console.log('Oracle database connected successfully');
        const connection = await pool.getConnection();
        const result = await connection.execute(
            "SELECT 'JobTrack_db connected successfully' AS MESSAGE FROM DUAL"
        )
        console.log(result[0][0]);
        await connection.close();
        const PORT = process.env.PORT||5000;
        app.listen(PORT,()=>{
            console.log('Connected')
        })
    } catch (error) {
        console.log('Not Connected')
    }
}
