const express = require('express')
const cors = require('cors')
const { setupMulter } = require('./multer')
const { createTransactionController } = require('../src/modules/transactions/routes')

const upload = setupMulter()

const app = express()
app.use(express.json())
app.use(cors())

app.post('/history', upload.single('history'), createTransactionController)

module.exports = app
