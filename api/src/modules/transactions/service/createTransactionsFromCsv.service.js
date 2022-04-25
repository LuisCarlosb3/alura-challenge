const { createReadStream, unlinkSync } = require('fs')
const { parse } = require('csv-parse')

module.exports = function createTransactionsFromCsv (transactionRepository) {
  async function checkFirstLine (file) {
    return new Promise((resolve, reject) => {
      const stream = createReadStream(file)
      const parseFile = parse()
      stream.pipe(parseFile)
      parseFile.on('data', async line => {
        const transaction = transactionParse(line)
        const allFieldsOk = checkIfAreEmptyFields(transaction)
        if (allFieldsOk) {
          resolve(transaction)
        }
      }).on('end', () => {
        resolve(null)
      }).on('error', (err) => {
        reject(err)
      })
    })
  }
  async function loadRegisters (file, baseDate) {
    return new Promise((resolve, reject) => {
      const registers = []
      const stream = createReadStream(file)
      const parseFile = parse()
      stream.pipe(parseFile)
      parseFile.on('data', async line => {
        const transaction = transactionParse(line)
        const allFieldsOk = checkIfAreEmptyFields(transaction)
        const isSameDate = checkIfIsSameDate(baseDate, transaction)

        if (!allFieldsOk || !isSameDate) {
          return
        }

        registers.push(transaction)
      }).on('end', () => {
        resolve(registers)
      }).on('error', (err) => {
        reject(err)
      })
    })
  }
  function transactionParse (csvLine) {
    const transaction = {
      bankOrigin: csvLine[0],
      agencyOrigin: csvLine[1],
      accountOrigin: csvLine[2],
      bankDestiny: csvLine[3],
      agencyDestiny: csvLine[4],
      accountDestiny: csvLine[5],
      amount: parseFloat(csvLine[6]),
      date: new Date(csvLine[7])
    }
    return transaction
  }
  function checkIfIsSameDate (baseDate, newTransaction) {
    const base = new Date(baseDate)
    const newDate = new Date(newTransaction.date)
    base.setHours(0, 0, 0, 0)
    newDate.setHours(0, 0, 0, 0)
    return (base.getTime() === newDate.getTime())
  }
  function checkIfAreEmptyFields (transaction) {
    for (const key in transaction) {
      if (transaction[key] === null || transaction[key] === '') {
        return false
      }
    }
    return true
  }
  return async ({ filePath }) => {
    const firstTransaction = await checkFirstLine(filePath)
    if (!firstTransaction) {
      const emptyErr = new Error('File is empty')
      emptyErr.name = 'emptyFile'
      throw emptyErr
    }
    const exists = await transactionRepository.checkIfTransactionExistsByDate({ transactionDate: firstTransaction.date })
    if (exists) {
      const emptyErr = new Error('Already exists transactions for ' + firstTransaction.date.toISOString())
      emptyErr.name = 'transactionAlreadyExists'
      throw emptyErr
    }
    const transactions = await loadRegisters(filePath, firstTransaction.date)
    transactionRepository.createTransactionsInBatch({ transactions })
    unlinkSync(filePath)
  }
}
