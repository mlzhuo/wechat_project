const http = require('http')
const YAML = require('yamljs')
const config = YAML.load(process.cwd() + '/wechat.conf')
global.config = config
const { servicePort } = config
const app = require('./app')
app.set('port', servicePort)
server = http.createServer(app)
server.listen(servicePort, function() {
  console.log(
    `[${new Date().toLocaleString()}] SUCCESS App listening on port ${servicePort}`
  )
})
