const express = require('express')
const request = require('request')
let jsapi_ticket = { timestamp: new Date().getTime(), ticket: '' }
const app = express()
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method == 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const getAccessToken = () => {
  request(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${global.config.AppID}&secret=${global.config.AppSecret}`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const { access_token } = JSON.parse(body)
        getJsApiTicket(access_token)
      }
    }
  )
}
const getJsApiTicket = access_token => {
  request(
    `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const { ticket } = JSON.parse(body)
        jsapi_ticket = { timestamp: new Date().getTime(), ticket }
      }
    }
  )
}
app.use('/api/airkiss', (req, res) => {
  res.send({ data: jsapi_ticket })
})

// 每两个小时更新 access_token
getAccessToken()
setInterval(getAccessToken, 7150 * 1000)

module.exports = app
