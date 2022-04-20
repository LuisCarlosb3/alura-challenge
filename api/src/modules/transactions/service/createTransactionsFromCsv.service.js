const { createReadStream, unlinkSync } = require('fs')
const { parse } = require('csv-parse')

module.exports = function createTransactionsFromCsv (createTransactionRepository, checkIfTransactionExistsByDateRepository) {
  async function loadRegisters (file) {
    return new Promise((resolve, reject) => {
      const registers = []
      const stream = createReadStream(file)
      const parseFile = parse()
      stream.pipe(parseFile)
      parseFile.on('data', async line => {
        const transaction = transactionParse(line)
        if (registers[0]) {
          const isSameDate = checkIfIsSameDate(registers[0].date, transaction)
          const allFieldsOk = checkIfAreEmptyFields(transaction)
          if (!isSameDate || !allFieldsOk) {
            return
          }
        }
        if (!registers[0]) {
          const exists = await checkIfTransactionExistsByDateRepository(transaction.date)
          if (exists) {
            const emptyErr = new Error('Already exists transactions for ' + transaction.date.toISOString())
            emptyErr.name = 'transactionAlreadyExists'
            reject(emptyErr)
          }
        }

        registers.push(transaction)
      }).on('end', () => {
        if (registers.length === 0) {
          const emptyErr = new Error('File is empty')
          emptyErr.name = 'emptyFile'
          reject(emptyErr)
        }
        unlinkSync(file)
        resolve(registers)
      }).on('error', (err) => {
        unlinkSync(file)
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
    return (newTransaction.date === baseDate)
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
    const transactions = await loadRegisters(filePath)
    createTransactionRepository(transactions)
  }
}
