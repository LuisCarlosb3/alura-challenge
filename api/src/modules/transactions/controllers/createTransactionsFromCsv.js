
module.exports = function createTransactionsFromCsv (createTransactionsService, createImportService) {
  return async (request, response) => {
    try {
      const filePath = request.file.path
      const transactions = await createTransactionsService({ filePath })
      const transactionDate = transactions[0].date
      await createImportService({ importDate: transactionDate })
      response.json({ message: 'your file was received' })
    } catch (error) {
      console.error(error.name)
      let status = 500
      if (error.name === 'emptyFile' || error.name === 'transactionAlreadyExists') {
        status = 400
      }
      return response.status(status).json({ message: error.message })
    }
  }
}
