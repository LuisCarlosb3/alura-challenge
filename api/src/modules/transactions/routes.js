const createTransactionsFromCsv = require('./controllers/createTransactionsFromCsv')
const createTransactionsService = require('./service/createTransactionsFromCsv.service')
const transactionRepository = require('./repository/transactionRepository')

const serviceHandler = createTransactionsService(
  transactionRepository,
  transactionRepository
)
const createTransactionController = createTransactionsFromCsv(serviceHandler)

module.exports = { createTransactionController }
