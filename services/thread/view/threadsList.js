const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()

const getAllThreads = async (req, res) => {
    const appDataSource = new DataSource(
        {
            type: process.env.TYPEORM_CONNECTION,
            host: '127.0.0.1',
            port: '3306',
            username: process.env.TYPEORM_USERNAME,
            password: '1234',
            database: "wethreads_50"
        }
    )
    appDataSource.initialize().then(
        () => {
            console.log("Initialized! Your DB is initialized via typeorm DataSource")
    }
    )

    const AllThreads = await appDataSource.query(
        `
        SELECT 
        users.id, 
        threads.id, 
        threads.user_id, 
        threads.content, 
        users.nickname, 
        threads.created_at 
        FROM threads 
        INNER JOIN users ON users.id = threads.user_id;
        `
    )
    console.log("TYPEORM DATA RETURNS EVERY DATA OF THREADS, LENGTH: ", AllThreads.length)

    return res.status(200).json({"message": "All the Threads' been Loaded Successfully", "threads": AllThreads})
}

module.exports = { getAllThreads }