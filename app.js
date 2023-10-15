const http = require('http')
const express = require('express')
const { signUp } = require("./services/user/signUp")
const {getAllThreads} = require("./services/thread/view/threadsList");
const {deleteThread} = require("./services/thread/model/deleteThread");
const {onlyUserThread} = require("./services/thread/view/userThread");
const {createThread} = require("./services/thread/model/createThread");
const {modifyThread} = require("./services/thread/model/modifyThread");
const {createLike} = require("./services/like/createLike");
// /  POST login요청이 들어오면 body에 id와 password를 실어서 요청으로 가정해서 jwt를 발급해준다.


// app.post("/login", );



//session의 id (user table의 pk id)를 client 단에 보내는 session에 저장하고, 민감 정보는
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
// 주석이 많은 관계로 추후에 주석을 view, controllers, model 폴더 내로 이동하겠다
// ---------------------
app.post('/users/sign-up', signUp)



// next > users table에 담긴 nickname을 가져온다
// nickname은 thread/user_id 값과 같은 primary key id를 가진 users data의 nickname을 불러온다.
// 좋아요를 누를 때는 게시물 목록 화면에서 누른다.
app.get('/thread', getAllThreads)
// createLike RESTAPI로 구현
app.post('/thread', createLike)
app.get('/thread/:id', onlyUserThread)
// createLike  => param.id로 넘긴 /:id 페이지에서 RESTAPI로 구현
app.post('/thread/:id', createLike)

// threads를 db에 남겨라
// thread/create 화면은 thread content 작성 화면
// /thread에서 /thread/create로 넘어갈 때,
// 게시판 글 작성 권한 체크 등으로 session에 저장된 users의 pk id값을 체크해 작성 페이지로의 권한을 분류하고
// /thread/create에서 작성 후 작성 완료 버튼을 눌러서 post요청을 할 때, session에서 login한 id 값을 꺼내서 request.body의 content와 함께 db의 thread.user_id에 INSERT한다.

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

// session에 대해서 너무 복잡하게 생각할 필요가 없다.
// session을 구현하는 건 express가 하는 일이다.
// jsp로 session의 민감 정보를 db에 담은 것을 검증하는 것을 보고 너무 복잡하다고 여길 수 있는데, 이는 전부 기술적인 부분이다.
// 걱정할 필요가 없다.
// 예를 들면, 민감 정보인 주소, 연락처를 담아서 cj 택배사를 통해서 목적지 친구 주소로 보낸다. 이떄 사용자는 cj 택배사가 어떻게 택배를 목적지로 보내는 데에 관심이 있을까?
// 택배사가 택배를 보내는 방법 중에 중간에 수많은 hub를 거쳐서 보내는 방법은 다양하다. 이떄 hub를 연결시키는 로직, hub를 구축하는 건축 비용, 방법 등에 사용자가 관심이 있을까?
// 정답은 아니다 이다. 그 중간에 Hub를 거치는 방법 등에 대해선 사용자도, 받는 친구도 알 수 없을 뿐더러 그 일에 대해서는 택배사가 더 잘 안다. 그들은 (뛰어난) 기술자인 셈이다.
// 택배사의 운송법이 cookie인 것이다.
// 사용자나, 받는 사람은 택배 운송 방법에 대해서 몰라도 상관이 없다. 그것에 대해서 잘 안다고 더 택배를 잘 보낼 수 있는 것이 아니다.
// 추가로 택배 운송 방법에 대해 잘 안다고 사용자가 싸게 택배를 보낼 수 있는 것도 아니고, 받는 사람이 더 빠르게 택배를 받을 수 있는 것도 아니다.
// session은 택배사가 보내는 택배의 민감 정보인 것이다. 보낼 때 잘 필요한 것만 적어서 보내고, 받는 사람 입장에서 본인이 수신한 거라는 것을 확인할 수 있는 정보를 담아서 보내야 한다.