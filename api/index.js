'use strict'

const fs = require('fs')
const express = require('express')

const db = require('../db/mongodb')
const themify = require('../utils/themify')

let PLACES = parseInt(process.env.VIEW_LEN)
PLACES >= 5 && PLACES <= 18 ? NaN : PLACES = 7

const app = express()

// get the image
app.get('/get/@:name', async (req, res) => {
  const { name } = req.params
  const { theme = 'moebooru' } = req.query
  let length = PLACES

  // This helps with GitHub's image cache 
  res.set({
    'content-type': 'image/svg+xml',
    'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
  })

  const data = await getCountByName(name)

  if (name === 'demo') {
    res.set({
      'cache-control': 'max-age=31536000'
    })
    length = 10
  }

  // Send the generated SVG as the result
  const renderSvg = themify.getCountImage({ count: data.num, theme, length })
  res.send(renderSvg)

  console.log(data, `theme: ${theme}`, `ref: ${req.get('Referrer') || null}`, `ua: ${req.get('User-Agent') || null}`)
})

// JSON record
app.get('/record/@:name', async (req, res) => {
  const { name } = req.params

  const data = await getCountByName(name)

  res.json(data)
})

app.get('/heart-beat', (req, res) => {
  res.set({
    'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
  })

  res.send('alive')
  console.log('heart-beat')
});

app.get('*', function (req, res){
  res.send('<p>404</p>');
});

const port = process.env.PORT || 3001;
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

let __cache_counter = {}, shouldPush = false

let sec = parseInt(process.env.DELAY_SEC)
sec >= 1 && sec <= 180 ? NaN : sec = 60
setInterval(() => {
  shouldPush = true
}, 1000 * sec);

async function pushDB() {
  if (!shouldPush) return

  try {
    shouldPush = false
    if (Object.keys(__cache_counter).length === 0) return

    console.log("pushDB", __cache_counter)

    const counters = Object.keys(__cache_counter).map(key => {
      return {
        name: key,
        num: __cache_counter[key]
      }
    })

    await db.setNumMulti(counters)
    __cache_counter = {}
  } catch (error) {
    console.log("pushDB is error: ", error)
  }
}

async function getCountByName(name) {
  const defaultCount = { name, num: 0 }

  if (name === 'demo') return { name, num: '0123456789' }

  try {
    if (!(name in __cache_counter)) {
      const counter = await db.getNum(name) || defaultCount
      __cache_counter[name] = counter.num + 1
    } else {
      __cache_counter[name]++
    }

    pushDB()

    return { name, num: __cache_counter[name] }

  } catch (error) {
    console.log("get count by name is error: ", error)
    return defaultCount

  }
}
