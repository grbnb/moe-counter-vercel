const mongoose = require('mongoose')
const themify = require('../utils/themify')

const db_url = process.env.DB_URL

let db = null
let Count

module.exports = async (req, res) => {
    let {
        name = 'index',
            theme = 'moebooru'
    } = req.query

    await connectToDatabase(db_url)
    user_data = await getCountByName(name)
    console.log(user_data)

    let length = 7

    const renderSvg = themify.getCountImage({
        count: user_data.num,
        theme,
        length
    })
    res.setHeader(
        "cache-control",
        "max-age=0, no-cache, no-store, must-revalidate",
    );
    res.setHeader("content-type", "image/svg+xml; charset=utf-8");
    res.send(renderSvg)
}

async function getCountByName(name) {
    const defaultCount = {
        name,
        num: 0
    }
    if (name === 'demo') return {
        name,
        num: '0123456789'
    }
    try {
        const counter = await getNum(name) || defaultCount
        const num = counter.num + 1
        setNum(counter.name, num)
        return counter
    } catch (error) {
        console.log("get count by name is error: ", error)
        return defaultCount
    }
}

async function connectToDatabase(uri) {
    // If the database connection is cached,
    // use it instead of creating a new connection
    if (db) return db
    if (!uri) throw new Error('未设置环境变量 MONGODB_URI')
    // If no connection is cached, create a new one
    console.log('Connecting to database...')
    db = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    console.log('Connected to database')

    await Count_model()

    return db
}

async function Count_model() {
    let schema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        num: {
            type: Number,
            required: true
        }
    }, {
        collection: 'tb_count',
        versionKey: false
    });
    Count = db.model('Count', schema)
}

async function getNum(name) {
    return Count
        .findOne({
            name
        }, '-_id -__v')
        .exec()
}

function getAll() {
    return Count
        .find({}, '-_id -__v')
        .exec()
}

function setNum(name, num) {
    return Count
        .findOneAndUpdate({
            name
        }, {
            name,
            num
        }, {
            upsert: true
        })
        .exec()
}





























// module.exports = async (req, res) => {
//     request = req
//     response = res
//     const event = request.body || {}
//     // console.log('请求ＩＰ：', request.headers['x-real-ip'])
//     // console.log('请求方法：', event.event)
//     // console.log('请求参数：', event)
//     let res = {}
//     try {
//         anonymousSignIn()
//         await connectToDatabase(process.env.MONGODB_URI)
//         await readConfig()
//         allowCors()
//         if (request.method === 'OPTIONS') {
//             response.status(204).end()
//             return
//         }
//         switch (event.event) {
//             case 'GET_FUNC_VERSION':
//                 res = getFuncVersion()
//                 break
//             case 'COMMENT_GET':
//                 res = await commentGet(event)
//                 break
//             case 'COMMENT_GET_FOR_ADMIN':
//                 res = await commentGetForAdmin(event)
//                 break
//             case 'COMMENT_SET_FOR_ADMIN':
//                 res = await commentSetForAdmin(event)
//                 break
//             case 'COMMENT_DELETE_FOR_ADMIN':
//                 res = await commentDeleteForAdmin(event)
//                 break
//             case 'COMMENT_IMPORT_FOR_ADMIN':
//                 res = await commentImportForAdmin(event)
//                 break
//             case 'COMMENT_LIKE':
//                 res = await commentLike(event)
//                 break
//             case 'COMMENT_SUBMIT':
//                 res = await commentSubmit(event)
//                 break
//             case 'POST_SUBMIT':
//                 res = await postSubmit(event.comment)
//                 break
//             case 'COUNTER_GET':
//                 res = await counterGet(event)
//                 break
//             case 'GET_PASSWORD_STATUS':
//                 res = await getPasswordStatus()
//                 break
//             case 'SET_PASSWORD':
//                 res = await setPassword(event)
//                 break
//             case 'GET_CONFIG':
//                 res = await getConfig()
//                 break
//             case 'GET_CONFIG_FOR_ADMIN':
//                 res = await getConfigForAdmin()
//                 break
//             case 'SET_CONFIG':
//                 res = await setConfig(event)
//                 break
//             case 'LOGIN':
//                 res = await login(event.password)
//                 break
//             case 'GET_COMMENTS_COUNT': // >= 0.2.7
//                 res = await getCommentsCount(event)
//                 break
//             case 'GET_RECENT_COMMENTS': // >= 0.2.7
//                 res = await getRecentComments(event)
//                 break
//             case 'EMAIL_TEST': // >= 1.4.6
//                 res = await emailTest(event)
//                 break
//             case 'UPLOAD_IMAGE': // >= 1.5.0
//                 res = await uploadImage(event)
//                 break
//             default:
//                 if (event.event) {
//                     res.code = RES_CODE.EVENT_NOT_EXIST
//                     res.message = '请更新 Twikoo 云函数至最新版本'
//                 } else {
//                     res.code = RES_CODE.NO_PARAM
//                     res.message = 'Twikoo 云函数运行正常，请参考 https://twikoo.js.org/quick-start.html#%E5%89%8D%E7%AB%AF%E9%83%A8%E7%BD%B2 完成前端的配置'
//                     res.version = VERSION
//                 }
//         }
//     } catch (e) {
//         console.error('Twikoo 遇到错误，请参考以下错误信息。如有疑问，请反馈至 https://github.com/imaegoo/twikoo/issues')
//         console.error('请求参数：', event)
//         console.error('错误信息：', e)
//         res.code = RES_CODE.FAIL
//         res.message = e.message
//     }
//     if (!res.code && !request.body.accessToken) {
//         res.accessToken = accessToken
//     }
//     console.log('请求返回：', res)
//     response.status(200).json(res)
// }