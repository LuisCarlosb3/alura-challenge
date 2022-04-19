const app = require("./config/server")
const mongoClient = require('./src/repository-util/mongodb-setup')
const env = require('./config/env')

mongoClient.connect(env.mongoUrl).then(()=>{
  console.log('MONGODB:: ready')
  app.listen(3000, () => {
    console.log('listening on port 3000')
  })
}).catch((err )=>{
  console.error('MONGODB:: '+err.message)
})