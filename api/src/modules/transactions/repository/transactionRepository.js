const mongoDb = require('../../../repository-util/mongodb-setup')

module.exports = {
  collection: 'transaction',
  async createTransactionsInBatch ({ transactions }) {
    const collection = await mongoDb.getCollection(this.collection)
    const response = await collection.insertMany(transactions)
    return response.insertedIds
  },
  async checkIfTransactionExistsByDate ({ transactionDate }) {
    const day = transactionDate.getDate()
    const month = transactionDate.getMonth()
    const year = transactionDate.getFullYear()
    const original = new Date(year, month, day)
    const next = new Date(year, month, day + 1)
    const collection = await mongoDb.getCollection(this.collection)
    const exists = await collection.findOne({
      date: {
        $gte: original,
        $lte: next
      }
    })
    return exists !== null
  }
}
