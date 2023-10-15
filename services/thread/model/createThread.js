const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()




const createThread = async (req, res) => {
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
            console.log("Data Source has been initialized!");
        })

    const threadContent = req.body.content;
    const userId = req.body.user_id
    // console.log(threadContent, " is Written By", userId)


    // Post Creating BuildUp (POST 전까지 미실행)
    const userThread = await appDataSource.query(
        `
        INSERT INTO threads (
        content, user_id
        )
        VALUES (
        '${threadContent}'
        '${userId}'
        );
        `
    )
    console.log("TYPEORM DATA RETURNS LENGTH: ", userThread.length)

    return res.status(201).json({"message": "threadCreated!"})


}

module.exports = { createThread }