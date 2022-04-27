const createTransactionsFromCsv = require('./controllers/createTransactionsFromCsv')
const createTransactionsService = require('./service/createTransactionsFromCsv.service')
const transactionRepository = require('./repository/transactionRepository')
const createImportService = require('../imports/service/createImport.service')
const importsRepository = require('../imports/repository/importsRepository')

const createImportServiceHandler = createImportService(importsRepository)

const createTransactionServiceHandler = createTransactionsService(
  transactionRepository,
  transactionRepository
)
const createTransactionController = createTransactionsFromCsv(createTransactionServiceHandler, createImportServiceHandler)

module.exports = { createTransactionController }
