const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()


const signUp = async(req, res) => {
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

    // variables in signUp() Announcement and values Appending
    const userNickName = req.body.nickname
    const userEmail = req.body.email
    const userPassword = req.body.password

    // 3 params Saviour
    const userData = await appDataSource.query(`
      INSERT INTO users (
      nickname,
      email,
      password
        )
    VALUES (
      '${userNickName}',
      '${userEmail}',
      '${userPassword}'
        )`)

    // just Logging. If ./.env.LOGGING === FALSE, NO LOGGING WILL APPEAR ON CONSOLE (그냥 한국어로 적을까)
    console.log("TYPEORM DATA RETURNS: ", userData)

    return res.status(201).json({"message": "userCREATED"})
}

module.exports = { signUp }