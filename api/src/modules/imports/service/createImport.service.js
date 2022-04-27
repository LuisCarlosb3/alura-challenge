module.exports = function createImport (importsRepository) {
  return async ({ importDate }) => {
    const onlyDate = importDate.toISOString()
    const importData = {
      transactionsDate: onlyDate.replace(/T.*/, ''),
      createdAt: new Date()
    }
    await importsRepository.createImport({ importData })
  }
}
