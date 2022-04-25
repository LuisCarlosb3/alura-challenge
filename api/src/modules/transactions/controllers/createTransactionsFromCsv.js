
module.exports = function createTransactionsFromCsv (createTransactionsService) {
  return async (request, response) => {
    try {
      const filePath = request.file.path
      await createTransactionsService({ filePath })
      response.json({ message: 'your file was received' })
    } catch (error) {
      console.log(error.message)
      let status = 500
      if (error.name === 'emptyFile' && error.name === 'transactionAlreadyExists') {
        status = 400
      }
      return response.status(status).json({ message: error.message })
    }
  }
}
