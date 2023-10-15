const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()

const onlyUserThread = async (req, res) => {
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
    const userId = req.body.userId
    // 원래 req.session에서 sessionId를 불러와야 한다.

    const userThread = await appDataSource.query(
        `
        SELECT 
        users.id, 
        threads.id, 
        threads.user_id, 
        threads.content, 
        users.nickname, 
        threads.created_at 
        FROM threads 
        INNER JOIN users ON users.id = threads.user_id WHERE users.user_id = '${userId}';        `
    )

    console.log("TYPEORM DATA RETURNS EVERY DATA OF THREADS, LENGTH: ", userThread.length)


    // 그냥 app.js에서 error 설정하도록 하자.
    // try {
    //     if (userThread.length === 0) {
    //         res.statusCode(404).statusMessage("Not Found, Please Check if you're logged in well")
    //     }
    // }
    // catch (err) {
    //     console.error(err)
    // }


    return res.status(200).json({"message": "Your Threads' been Loaded Successfully", "threads": userThread} )
}

module.exports = { onlyUserThread }