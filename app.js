const http = require('http')
const express = require('express')
const { signUp } = require("./services/user/signUp")
const {getAllThreads} = require("./services/thread/view/threadsList");
const {deleteThread} = require("./services/thread/model/deleteThread");
const {onlyUserThread} = require("./services/thread/view/userThread");
const {createThread} = require("./services/thread/model/createThread");
const {modifyThread} = require("./services/thread/model/modifyThread");
const {createLike} = require("./services/like/createLike");

//
// --------------------------------------------------------------------------------------------------------
const app = express()

app.use(express.json())
// cors는 추후에 설정.
// // --------------------------------------------------------------------------------------------------------
//

// babel로 js decorator로 DataSource Class를 불러올 수는 없을까?

// --------------------------------------------------------------------------------------------------------

// Health Check, server Create
app.get("/ping", async(req, res) => {
    res.status(200).json(
        { "message": "pong!!!!!!" }
    )
})

const server = http.createServer(app)
// --------------------------------------------------------------------------------------------------------

// 넣는 작업만 해 보자
// 주석이 많은 관계로 추후에 주석을 view, controller, model 폴더 내로 이동하겠다
// ---------------------
app.post('/users/sign-up', signUp)



// next > users table에 담긴 nickname을 가져온다
// nickname은 thread/user_id 값과 같은 primary key id를 가진 users data의 nickname을 불러온다.
// 좋아요를 누를 때는 게시물 목록 화면에서 누른다.
app.get('/thread', getAllThreads)
app.post('/thread', createLike)
app.get('/thread/user', onlyUserThread)
app.post('/thread/user', createLike)
// threads를 db에 남겨라
// thread/create 화면은 thread content 작성 화면

app.post('/thread/create', createThread)

// comments delete은 thread/target-comment/delete으로
// comment, thread 삭제 둘 다 /thread에서 실행한다. (thread/~/delete로 redirect)

app.delete('/thread/target-thread/delete', deleteThread)
app.patch('/thread/update', modifyThread)




const start = async () => {
    console.log("Maybe it will be the last survivor of this Function Start")
    try {
        server.listen(8000, () => console.log('Server is listing on PORT 8000'))
    }
    catch (err) {
        console.error(err)
    }
}

// 지우면 안됨
start()