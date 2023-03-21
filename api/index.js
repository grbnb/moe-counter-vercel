const mongoose = require('mongoose')
const themify = require('../utils/themify')

const db_url = process.env.DB_URL
let up_sert = process.env.DB_UPSERT || false

let db = null
let Count

module.exports = async (req, res) => {
    let {
        name = ':name',
            theme = 'moebooru'
    } = req.query

    await connectToDatabase(db_url)
    user_data = await getCountByName(name)
    console.log(user_data)
    let PLACES = parseInt(process.env.VIEW_LEN)
    PLACES >= 5 && PLACES <= 18 ? NaN : PLACES = 7

    let length = PLACES

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

async function connectToDatabase(url) {
    // If the database connection is cached,
    // use it instead of creating a new connection
    if (db) return db
    if (!url) throw new Error('未设置环境变量 DB_URL')
    up_sert === "true" ? up_sert = true : up_sert = false
    console.log('插入新文档模式(true/false): ',up_sert)
    // If no connection is cached, create a new one
    console.log('Connecting to database...')
    db = await mongoose.connect(url, {
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
            upsert: up_sert
        })
        .exec()
}

