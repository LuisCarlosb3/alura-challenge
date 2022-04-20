const express = require('express')
const cors = require('cors')
const { setupMulter } = require('./multer')
const createTransactionsFromCsv = require('../src/modules/transactions/controllers/createTransactionsFromCsv')

const upload = setupMulter()

const app = express()
app.use(express.json())
app.use(cors())

app.post('/history', upload.single('history'), createTransactionsFromCsv())


module.exports = app
