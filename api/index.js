const express = require('express')
const cors = require('cors')
const { setupMulter } = require('./config/multer')
const createTransactionsFromCsv = require('./src/controllers/createTransactionsFromCsv')

upload = setupMulter()

const app = express()
app.use(express.json())
app.use(cors())

app.post('/history', upload.single('history'), createTransactionsFromCsv())


app.listen(3000, () => {
  console.log('listening on port 3000')
})