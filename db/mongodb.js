'use strict'

const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  name: { type: String, required: true },
  num:  { type: Number, required: true }
}, { collection: 'tb_count', versionKey: false });

// the default mongodb url (local server)
const mongodbURL = process.env.DB_URL
let up_sert = process.env.DB_UPSERT || false

if (!mongodbURL) throw new Error('未设置环境变量 DB_URL')
up_sert === "true" ? up_sert = true : up_sert = false
console.log('插入新文档模式(true/false): ',up_sert)

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, function (error) {
    if (error) {
        console.log("连接mongo数据库失败:" + error.message)
    } else {
        console.log("连接mongo数据库成功")
    }
})


const Count = mongoose.connection.model('Count', schema)

function getNum(name) {
  return Count
          .findOne({ name }, '-_id -__v')
          .exec()
}

function getAll() {
  return Count
          .find({ }, '-_id -__v')
          .exec()
}

function setNum(name, num) {
  return Count
          .findOneAndUpdate({ name }, { name, num }, { upsert: true })
          .exec()
}

function setNumMulti(counters) {
  const bulkOps = counters.map(obj => {
    const { name, num } = obj
    return {
      updateOne: {
        filter: { name },
        update: { name, num },
        upsert: up_sert
      }
    }
  })

  return Count.bulkWrite(bulkOps, { ordered : false })
}

module.exports = {
  getNum,
  getAll,
  setNum,
  setNumMulti
}
