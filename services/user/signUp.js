const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()
require("express-async-errors")
const { body, validationResult } = require("express-validator")

const signUp = async( req, res) => {
   const appDataSource = new DataSource(
        {
            type: process.env.TYPEORM_CONNECTION,
            host: '127.0.0.1',
            port: '3306',
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
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

    // Password Impact Check 숫자/영대문/영소문/특문 모두 포함 및 8자 이상
    const checkPassword = () => {

        let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

        let pw = userPassword.val();

        if(reg.test(pw) === false) {
            alert('비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.');
        }
        else {
            console.log("통과");
        }
    }
    checkPassword()


    // signUp 단계에서 signUp input에 입력하여 valid 검증을 하면
    // 사용 가능한 nickname이면 200 method res를 받는 게 낫다.
    // email도 마찬가지
    // 두 조건을 동시에 전부 돌리는 것보다 두 조건 따로 돌리는 게 낫다.
    // ajax 구현도 방법 중 하나(email, nickname 중복 검증 버튼 생성)

    const validateEmailInfo = await appDataSource(
           `
           SELECT id FROM users 
           WHERE email = '${userEmail}'
           `
    )
    // express-async-errors 가 없으면 next로 error를 call해야 한다.
    if (validateEmailInfo.length)  {
        // throw new Error ("INVALID EMAIL. THE EMAIL IS ALREADY USED");
        return res.status(409)
    }
    const validateNicknameInfo = await appDataSource(
        `
           SELECT id FROM users 
           WHERE nickname = '${userNickName}'
           `
    )
    if (validateNicknameInfo.length) {
        // throw new Error ("INVALID NICKNAME")
        return res.status(409).json({"message": "INVALID NICKNAME"});
    }


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